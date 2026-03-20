from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum

class OrderStatus(str, Enum):
    pending = "pending"
    pending_cash = "pending_cash"
    paid = "paid"

class Table(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    number: int
    is_occupied: bool = Field(default=False)

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    
    menu_items: List["MenuItem"] = Relationship(back_populates="category")

class MenuItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: float
    ingredients: Optional[str] = None
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    
    category: Optional[Category] = Relationship(back_populates="menu_items")

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    table_id: int = Field(foreign_key="table.id")
    status: OrderStatus = Field(default=OrderStatus.pending)
    
    order_items: List["OrderItem"] = Relationship(back_populates="order")

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    menu_item_id: int = Field(foreign_key="menuitem.id")
    quantity: int = Field(default=1)
    status: OrderStatus = Field(default=OrderStatus.pending)
    
    order: Optional["Order"] = Relationship(back_populates="order_items")
