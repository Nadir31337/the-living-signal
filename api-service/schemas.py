from pydantic import BaseModel, Field, field_validator
from typing import Optional
import re

class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="API health status")
    uptime: float = Field(description="Uptime in seconds")
    latency_ms: float = Field(description="Internal latency measurement in ms")
    timestamp: str = Field(description="ISO 8601 UTC timestamp")

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Sender's full name")
    email: str = Field(..., description="Sender's email address")
    message: str = Field(..., min_length=10, max_length=5000, description="Message body")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        v_clean = v.strip()
        if not re.match(pattern, v_clean):
            raise ValueError("Invalid email format")
        return v_clean.lower()

class ContactResponse(BaseModel):
    success: bool
    message: str
    timestamp: str
    error_code: Optional[str] = None
