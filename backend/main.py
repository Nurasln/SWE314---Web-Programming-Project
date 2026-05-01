from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import List, Optional

from models import Table, MenuItem, Order, OrderItem, OrderStatus, Category, Staff
from database import create_db_and_tables, get_session
from schemas import AISuggestionRequest, AISuggestionResponse, CategoryCreate, StaffCreate, DashboardStats
from services.ai_service import AIWaiterService
from auth import create_access_token, get_current_admin

app = FastAPI(title="QuickPay: QR Menu & Split Bill")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/tables", response_model=List[Table])
def list_tables(session: Session = Depends(get_session)):
    return session.exec(select(Table)).all()

@app.post("/tables", response_model=Table)
def create_table(table: Table, session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    session.add(table)
    session.commit()
    session.refresh(table)
    return table

@app.put("/tables/{table_id}/clear", response_model=Table)
def clear_table(table_id: int, session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    table = session.get(Table, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    table.is_occupied = False
    session.add(table)
    session.commit()
    session.refresh(table)
    return table

@app.get("/categories", response_model=List[Category])
def list_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()

@app.post("/categories", response_model=Category)
def create_category(category_in: CategoryCreate, session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    category_data = category_in.dict() if hasattr(category_in, "dict") else category_in.model_dump()
    category = Category(**category_data)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@app.post("/menu-items", response_model=MenuItem)
def create_menu_item(menu_item: MenuItem, session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    session.add(menu_item)
    session.commit()
    session.refresh(menu_item)
    return menu_item

@app.get("/menu-items", response_model=List[MenuItem])
def list_menu_items(category_id: Optional[int] = None, session: Session = Depends(get_session)):
    query = select(MenuItem)
    if category_id:
        query = query.where(MenuItem.category_id == category_id)
    return session.exec(query).all()

@app.post("/orders", response_model=Order)
def create_order(table_id: int, session: Session = Depends(get_session)):
    table = session.get(Table, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    order = Order(table_id=table_id, status=OrderStatus.pending)
    session.add(order)

    table.is_occupied = True
    session.add(table)

    session.commit()
    session.refresh(order)
    return order

@app.post("/orders/{order_id}/items", response_model=OrderItem)
def add_order_item(order_id: int, menu_item_id: int, quantity: int = 1, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    menu_item = session.get(MenuItem, menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    order_item = OrderItem(order_id=order_id, menu_item_id=menu_item_id, quantity=quantity)
    session.add(order_item)
    session.commit()
    session.refresh(order_item)
    return order_item

@app.get("/orders/{order_id}/split-bill")
def split_bill(order_id: int, num_people: int = Query(..., gt=0), session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    total_amount = 0.0

    for item in order.order_items:
        menu_item = session.get(MenuItem, item.menu_item_id)
        if menu_item:
            total_amount += float(menu_item.price) * int(item.quantity)

    split_amount = total_amount / int(num_people)

    return {
        "order_id": order_id,
        "total_amount": round(total_amount, 2),
        "num_people": num_people,
        "amount_per_person": round(split_amount, 2),
        "currency": "USD"
    }

@app.put("/orders/{order_id}/pay")
def pay_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = OrderStatus.paid
    session.add(order)
    session.commit()
    session.refresh(order)

    return {"message": "Order marked as paid", "order_id": order_id, "status": order.status}

@app.get("/staff", response_model=List[Staff])
def list_staff(session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    return session.exec(select(Staff)).all()

@app.post("/staff", response_model=Staff)
def create_staff(staff_in: StaffCreate, session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    staff_data = staff_in.dict() if hasattr(staff_in, "dict") else staff_in.model_dump()
    staff = Staff(**staff_data)
    session.add(staff)
    session.commit()
    session.refresh(staff)
    return staff

@app.delete("/staff/{staff_id}")
def delete_staff(staff_id: int, session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    staff = session.get(Staff, staff_id)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    session.delete(staff)
    session.commit()
    return {"message": "Staff deleted successfully"}

@app.post("/admin/login")
def admin_login(pin: str = Query(...), session: Session = Depends(get_session)):
    staff = session.exec(select(Staff).where(Staff.pin == pin)).first()

    if not staff:
        if pin == "1234":
            token = create_access_token({"sub": "admin", "role": "admin"})
            return {
                "status": "success",
                "access_token": token,
                "token_type": "bearer",
                "role": "admin",
                "name": "Admin (Fallback)"
            }
        raise HTTPException(status_code=401, detail="Invalid PIN")

    token = create_access_token({"sub": staff.name, "role": staff.role.value})
    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "role": staff.role.value,
        "name": staff.name
    }

@app.get("/admin/dashboard-stats", response_model=DashboardStats)
def dashboard_stats(session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    orders = session.exec(select(Order)).all()
    total_revenue = 0.0

    for order in orders:
        if order.status == OrderStatus.paid:
            for item in order.order_items:
                if item.menu_item:
                    total_revenue += float(item.menu_item.price) * int(item.quantity)

    active_tables = len(session.exec(select(Table).where(Table.is_occupied == True)).all())
    total_orders = len(orders)

    return DashboardStats(
        total_revenue=total_revenue,
        active_tables=active_tables,
        total_orders=total_orders
    )

@app.get("/admin/revenue-trend")
def revenue_trend(session: Session = Depends(get_session), current_admin: dict = Depends(get_current_admin)):
    orders = session.exec(select(Order)).all()
    trend = []

    for order in orders:
        if order.status == OrderStatus.paid:
            revenue = 0.0

            for item in order.order_items:
                menu_item = session.get(MenuItem, item.menu_item_id)
                if menu_item:
                    revenue += float(menu_item.price) * int(item.quantity)

            trend.append({
                "label": f"Order #{order.id}",
                "revenue": round(revenue, 2)
            })

    return trend

ai_service = AIWaiterService()

@app.post("/ai/suggest", response_model=AISuggestionResponse)
@limiter.limit("5/minute")
def ai_suggest(request: Request, body: AISuggestionRequest, session: Session = Depends(get_session)):
    menu_items = session.exec(select(MenuItem)).all()

    if not menu_items:
        current_menu = "The menu is currently empty."
    else:
        current_menu = "\n".join([
            f"- {item.name}: ${item.price} ({item.category.name if item.category else 'No Category'})"
            for item in menu_items
        ])

    reply = ai_service.get_suggestion(
        user_message=body.user_message,
        current_menu=current_menu
    )

    return AISuggestionResponse(reply=reply)