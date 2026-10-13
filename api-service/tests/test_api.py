import pytest
from fastapi.testclient import TestClient
from main import app, client_requests

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Clear rate limiting table between tests."""
    client_requests.clear()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "uptime" in data
    assert data["uptime"] >= 0
    assert "latency_ms" in data
    assert data["latency_ms"] >= 0
    assert "timestamp" in data

def test_contact_valid_submission():
    payload = {
        "name": "Linus Torvalds",
        "email": "linus@example.com",
        "message": "Interested in discussing your software engineering internship candidacy!"
    }
    response = client.post("/contact", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Signal transmitted successfully" in data["message"]

def test_contact_invalid_email():
    payload = {
        "name": "Jane Doe",
        "email": "not-an-email",
        "message": "Hello there from test!"
    }
    response = client.post("/contact", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "INVALID_PAYLOAD"

def test_contact_message_too_short():
    payload = {
        "name": "Jane",
        "email": "jane@example.com",
        "message": "Short"
    }
    response = client.post("/contact", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "INVALID_PAYLOAD"

def test_contact_rate_limiting():
    payload = {
        "name": "Spam Tester",
        "email": "spammer@example.com",
        "message": "Sending repeated requests to trigger the rate limiter limit."
    }
    # First 5 requests should succeed
    for i in range(5):
        res = client.post("/contact", json=payload)
        assert res.status_code == 200, f"Request {i+1} failed"

    # 6th request should hit 429
    rate_limited_res = client.post("/contact", json=payload)
    assert rate_limited_res.status_code == 429
    data = rate_limited_res.json()
    assert data["success"] is False
    assert data["error_code"] == "RATE_LIMIT_EXCEEDED"
