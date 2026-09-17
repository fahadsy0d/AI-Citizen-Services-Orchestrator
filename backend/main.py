from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from contextlib import asynccontextmanager
import sqlite3 as sq
from database import DB_PATH, initialize_database
from brains import compiled_workflow, score_scheme

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield

app = FastAPI(lifespan=lifespan)

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
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the expected incoming data
class ServiceRequest(BaseModel):
    query: str
    thread_id: str

class ConsentRequest(BaseModel):
    user_consent: bool
    thread_id: str

# 3. Create the endpoint
@app.post("/api/analyze")
async def analyze_citizen_request(request: ServiceRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    initial_state = {
        "user_input": request.query,
        "user_consent": False
    }
    
    # Run the workflow
    final_state = compiled_workflow.invoke(initial_state, config)
    
    return {
        "status": "success", 
        "category": final_state.get("category"),
        "specific_goal": final_state.get("specific_goal"),
        "discovered_services": final_state.get("discovered_services", []),
        "agent_response": final_state.get("agent_response", "")
    }

@app.post("/api/consent")
async def process_consent(request: ConsentRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    compiled_workflow.update_state(config, {"user_consent": request.user_consent})
    final_state = compiled_workflow.invoke(None, config)
    
    return {
        "status": "success",
        "agent_response": final_state.get("agent_response", "")
    }

@app.get("/api/state")
async def get_state(thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    state = compiled_workflow.get_state(config)
    values = state.values if state else {}
    return {
        "status": "success",
        "category": values.get("category"),
        "specific_goal": values.get("specific_goal"),
        "missing_documents": values.get("missing_documents", []),
        "readiness_percentage": values.get("readiness_percentage", 0),
        "user_consent": values.get("user_consent", False),
        "agent_response": values.get("agent_response", "")
    }

@app.get("/api/services")
async def get_services(category: str | None = None, thread_id: str | None = None):
    # If we have a session, use its detected goal/category to score relevance.
    specific_goal = None
    score_category = category if category and category != "All" else None
    if thread_id:
        config = {"configurable": {"thread_id": thread_id}}
        state = compiled_workflow.get_state(config)
        values = state.values if state else {}
        specific_goal = values.get("specific_goal")
        if not score_category:
            score_category = values.get("category")

    with sq.connect(DB_PATH) as conn:
        conn.row_factory = sq.Row
        cursor = conn.cursor()
        if category and category != "All":
            cursor.execute("SELECT * FROM schemes WHERE category = ?", (category,))
        else:
            cursor.execute("SELECT * FROM schemes")
        results = cursor.fetchall()

    formatted_services = []
    for row in results:
        scheme = dict(row)
        scheme["match"] = score_scheme(scheme, specific_goal, score_category)
        formatted_services.append(scheme)

    formatted_services.sort(key=lambda s: s["match"], reverse=True)
    return {"services": formatted_services}