from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .routers import products, customers, orders

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventra API",
    description="Inventory & Order Management System",
    version="1.0.0",
)

# ─── CORS ────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(customers.router, prefix="/customers", tags=["Customers"])
app.include_router(orders.router,   prefix="/orders",   tags=["Orders"])


# ─── Health check ────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Inventra API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}