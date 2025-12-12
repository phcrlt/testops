from fastapi import FastAPI, Form
from backend.agent import generate_and_validate  

app = FastAPI(title="TestOps Copilot Backend")

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/generate-test")
def generate_test_endpoint(req: str = Form(...)):
    code, report = generate_and_validate(req)
    return {"code": code, "validation": report}

# Запуск: uvicorn backend.main:app --reload