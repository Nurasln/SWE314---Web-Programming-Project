from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List, Optional

from models import Table, MenuItem, Order, OrderItem, OrderStatus, Category
from database import create_db_and_tables, get_session
from schemas import AISuggestionRequest, AISuggestionResponse, CategoryCreate, TableBillResponse, PaymentRequest, TableBillItem
from services.ai_service import AIWaiterService

app = FastAPI(title="QuickPay: QR Menu & Split Bill")

# CORS Settings
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

# -----------------
# Table Endpoints
# -----------------
@app.get("/tables", response_model=List[Table])
def list_tables(session: Session = Depends(get_session)):
    tables = session.exec(select(Table)).all()
    return tables

@app.post("/tables", response_model=Table)
def create_table(table: Table, session: Session = Depends(get_session)):
    session.add(table)
    session.commit()
    session.refresh(table)
    return table

# -----------------
# Category Endpoints
# -----------------
@app.get("/categories", response_model=List[Category])
def list_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()

@app.post("/categories", response_model=Category)
def create_category(category_in: CategoryCreate, session: Session = Depends(get_session)):
    # Convert Pydantic model to dict, depending on Pydantic version
    category_data = category_in.dict() if hasattr(category_in, "dict") else category_in.model_dump()
    category = Category(**category_data)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

# -----------------
# Menu Endpoints
# -----------------
@app.post("/menu-items", response_model=MenuItem)
def create_menu_item(menu_item: MenuItem, session: Session = Depends(get_session)):
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

# -----------------
# Order Endpoints
# -----------------
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

# -----------------
# Split Bill Logic
# -----------------
@app.get("/orders/{order_id}/split-bill")
def split_bill(order_id: int, num_people: int = Query(..., gt=0), session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    total_amount: float = 0.0
    
    # Calculate total amount by fetching menu items for each order item
    for item in order.order_items:
        menu_item = session.get(MenuItem, item.menu_item_id)
        if menu_item:
            total_amount += float(menu_item.price) * int(item.quantity)
            
    split_amount: float = total_amount / int(num_people)
    
    return {
        "order_id": order_id,
        "total_amount": round(total_amount, 2),
        "num_people": num_people,
        "amount_per_person": round(split_amount, 2),
        "currency": "USD" # Can be altered depending on the region rules
    }

@app.get("/tables/{table_id}/bill", response_model=TableBillResponse)
def get_table_bill(table_id: int, session: Session = Depends(get_session)):
    orders = session.exec(select(Order).where(Order.table_id == table_id).where(Order.status == OrderStatus.pending)).all()
    items_resp = []
    total = 0.0
    for order in orders:
        for item in order.order_items:
            if item.status == OrderStatus.pending:
                menu_item = session.get(MenuItem, item.menu_item_id)
                if menu_item:
                    items_resp.append(TableBillItem(
                        order_item_id=item.id,
                        name=menu_item.name,
                        price=menu_item.price,
                        quantity=item.quantity
                    ))
                    total += float(menu_item.price) * item.quantity
    return TableBillResponse(items=items_resp, total_unpaid=round(total, 2))

@app.post("/tables/{table_id}/pay")
def pay_table_bill(table_id: int, payment: PaymentRequest, session: Session = Depends(get_session)):
    paid_total = 0.0
    
    target_status = OrderStatus.pending_cash if payment.method == "cash" else OrderStatus.paid
    
    for item_id in payment.order_item_ids:
        item = session.get(OrderItem, item_id)
        if item and item.status == OrderStatus.pending:
            order = session.get(Order, item.order_id)
            if order and order.table_id == table_id:
                item.status = target_status
                session.add(item)
                menu_item = session.get(MenuItem, item.menu_item_id)
                if menu_item:
                    paid_total += float(menu_item.price) * item.quantity
                    
    session.commit()
    
    # check if any orders are now fully paid or pending_cash
    orders = session.exec(select(Order).where(Order.table_id == table_id).where(Order.status == OrderStatus.pending)).all()
    for order in orders:
        all_resolved = all(i.status in (OrderStatus.paid, OrderStatus.pending_cash) for i in order.order_items)
        if all_resolved and len(order.order_items) > 0:
            order.status = OrderStatus.paid if target_status == OrderStatus.paid else OrderStatus.pending_cash
            session.add(order)
            
    session.commit()
    
    # if NO pending orders remain for table, mark table unoccupied
    pending_orders = session.exec(select(Order).where(Order.table_id == table_id).where(Order.status == OrderStatus.pending)).all()
    if not pending_orders:
        table = session.get(Table, table_id)
        if table:
            table.is_occupied = False
            session.add(table)
            session.commit()
            
    return {
        "message": "Payment successful" if payment.method != "cash" else "Marked for cash payment", 
        "paid_amount": round(paid_total, 2)
    }

# -----------------
# AI Waiter Endpoint
# -----------------
ai_service = AIWaiterService()

@app.post("/ai/suggest", response_model=AISuggestionResponse)
def ai_suggest(request: AISuggestionRequest, session: Session = Depends(get_session)):
    # Fetch current menu items securely from DB
    menu_items = session.exec(select(MenuItem)).all()
    if not menu_items:
        current_menu = "The menu is currently empty."
    else:
        current_menu = "\n".join([f"- {item.name}: ${item.price} ({item.category.name if item.category else 'No Category'})" + (f" - Ingredients/Info: {item.ingredients}" if item.ingredients else "") for item in menu_items])
        
    # Get suggestion from Groq AI
    reply = ai_service.get_suggestion(user_message=request.user_message, current_menu=current_menu)
    
    return AISuggestionResponse(reply=reply)

