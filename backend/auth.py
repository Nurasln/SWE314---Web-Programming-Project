import os
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt


SECRET_KEY = os.getenv("SECRET_KEY", "quickpay-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)

    if payload.get("two_factor") != "verified":
        raise HTTPException(status_code=401, detail="2FA verification required")

    return payload


def require_roles(allowed_roles: list[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role")

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied for role: {user_role}"
            )

        return current_user

    return role_checker


# -----------------
# Permission Helpers
# -----------------

def get_current_admin(current_user: dict = Depends(get_current_user)):
    allowed_roles = ["admin", "manager"]

    if current_user.get("role") not in allowed_roles:
        raise HTTPException(status_code=403, detail="Admin or Manager access required")

    return current_user


def admin_only(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return current_user


def manager_or_admin(current_user: dict = Depends(get_current_user)):
    allowed_roles = ["admin", "manager"]

    if current_user.get("role") not in allowed_roles:
        raise HTTPException(status_code=403, detail="Manager or Admin access required")

    return current_user


def staff_access(current_user: dict = Depends(get_current_user)):
    allowed_roles = ["admin", "manager", "waiter", "chef"]

    if current_user.get("role") not in allowed_roles:
        raise HTTPException(status_code=403, detail="Staff access required")

    return current_user