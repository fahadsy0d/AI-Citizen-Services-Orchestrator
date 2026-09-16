from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# 1. Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8443",
        "http://127.0.0.1:8443",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the expected incoming data
class ServiceRequest(BaseModel):
    query: str
    category: str | None = None

# 3. Create the endpoint
@app.post("/api/analyze")
async def analyze_citizen_request(request: ServiceRequest):
    # TODO: Add your AI orchestration logic here
    
    return {
        "status": "success", 
        "received_query": request.query,
        "message": "Connected successfully!"
    }