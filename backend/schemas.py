from pydantic import BaseModel
from typing import Optional, List

class TableBillItem(BaseModel):
    order_item_id: int
    name: str
    price: float
    quantity: int

class TableBillResponse(BaseModel):
    items: List[TableBillItem]
    total_unpaid: float

class PaymentRequest(BaseModel):
    order_item_ids: List[int]
    method: str = "card"

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class AISuggestionRequest(BaseModel):
    user_message: str

class AISuggestionResponse(BaseModel):
    reply: str
