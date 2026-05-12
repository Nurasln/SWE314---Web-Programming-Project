from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class AISuggestionRequest(BaseModel):
    user_message: str

class AISuggestionResponse(BaseModel):
    reply: str

class StaffCreate(BaseModel):
    name: str
    role: str
    pin: str

class DashboardStats(BaseModel):
    total_revenue: float
    active_tables: int
    total_orders: int

class ItemPayment(BaseModel):
    order_item_id: int
    quantity: int

class PaymentRequest(BaseModel):
    items: list[ItemPayment]
    payment_method: str # cash, meal_card, credit_card
