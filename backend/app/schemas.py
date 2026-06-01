from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime


# ─────────────────────────────────────────
# Product schemas
# ─────────────────────────────────────────

class ProductBase(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

    @field_validator("price")
    @classmethod
    def price_non_negative(cls, v):
        if v < 0:
            raise ValueError("Price cannot be negative")
        return v

    @field_validator("quantity")
    @classmethod
    def quantity_non_negative(cls, v):
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name:     Optional[str]   = None
    sku:      Optional[str]   = None
    price:    Optional[float] = None
    quantity: Optional[int]   = None

    @field_validator("price")
    @classmethod
    def price_non_negative(cls, v):
        if v is not None and v < 0:
            raise ValueError("Price cannot be negative")
        return v

    @field_validator("quantity")
    @classmethod
    def quantity_non_negative(cls, v):
        if v is not None and v < 0:
            raise ValueError("Quantity cannot be negative")
        return v


class ProductOut(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Customer schemas
# ─────────────────────────────────────────

class CustomerBase(BaseModel):
    name:  str
    email: EmailStr
    phone: str


class CustomerCreate(CustomerBase):
    pass


class CustomerOut(CustomerBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Order Item schemas
# ─────────────────────────────────────────

class OrderItemCreate(BaseModel):
    product_id: int
    quantity:   int

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v):
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v


class OrderItemOut(BaseModel):
    id:         int
    product_id: int
    quantity:   int
    unit_price: float
    product:    Optional[ProductOut] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Order schemas
# ─────────────────────────────────────────

class OrderCreate(BaseModel):
    customer_id: int
    items:       List[OrderItemCreate]

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, v):
        if not v:
            raise ValueError("Order must contain at least one item")
        return v


class OrderOut(BaseModel):
    id:           int
    customer_id:  int
    total_amount: float
    created_at:   Optional[datetime] = None
    customer:     Optional[CustomerOut] = None
    items:        List[OrderItemOut] = []

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# Dashboard schema
# ─────────────────────────────────────────

class DashboardOut(BaseModel):
    total_products:  int
    total_customers: int
    total_orders:    int
    total_revenue:   float
    low_stock:       List[ProductOut]
    out_of_stock:    List[ProductOut]