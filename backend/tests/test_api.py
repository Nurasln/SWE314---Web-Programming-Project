import os
os.environ["GROQ_API_KEY"] = "test-key"

from fastapi.testclient import TestClient
from main import app
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_docs_available():
    response = client.get("/docs")
    assert response.status_code == 200


def test_list_tables():
    response = client.get("/tables")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_menu_items():
    response = client.get("/menu-items")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_invalid_admin_login():
    response = client.post("/admin/login?pin=0000")
    assert response.status_code == 401


def test_admin_login_requires_2fa():
    response = client.post("/admin/login?pin=1234")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "2fa_required"
    assert "pending_token" in data


def test_2fa_rejects_wrong_code():
    login_response = client.post("/admin/login?pin=1234")
    pending_token = login_response.json()["pending_token"]

    response = client.post(
        "/admin/verify-2fa",
        json={
            "pending_token": pending_token,
            "code": "000000"
        }
    )

    assert response.status_code == 401


def test_2fa_accepts_correct_code():
    login_response = client.post("/admin/login?pin=1234")
    pending_token = login_response.json()["pending_token"]

    response = client.post(
        "/admin/verify-2fa",
        json={
            "pending_token": pending_token,
            "code": "246810"
        }
    )

    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    assert data["role"] == "admin"