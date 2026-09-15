import json
import re
import sqlite3 as sq
from typing import List, TypedDict

from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph

from database import DB_PATH, initialize_database


class CitizenState(TypedDict, total=False):
    user_input: str
    category: str
    specific_goal: str
    discovered_services: List[str]
    missing_documents: List[str]
    readiness_percentage: int
    user_consent: bool
    agent_response: str


llm = ChatOllama(model="llama3.2", temperature=0)


def _fallback_intent(current_message: str) -> dict:
    """Fallback intent inference when Ollama is unavailable."""
    message = current_message.lower()
    business_keywords = ["business", "grant", "startup", "entrepreneur", "small business", "loan"]
    employment_keywords = ["job", "employment", "unemployment", "benefits", "work", "salary"]

    if any(keyword in message for keyword in business_keywords):
        category = "Business"
        specific_goal = "Business funding or startup support"
    else:
        category = "Employment"
        specific_goal = "Employment support or unemployment benefits"

    if category == "Employment" and any(keyword in message for keyword in ["unemployment", "jobless", "layoff"]):
        specific_goal = "Unemployment benefits"

    return {"category": category, "specific_goal": specific_goal}


def detect_intent_node(state: CitizenState) -> dict:
    """Identify the user's service category and target outcome from natural language input."""
    current_message = state["user_input"]
    system_prompt = f"""Analyze this input: '{current_message}'.
    Find the most urgent need. Return ONLY JSON with keys: 'category' and 'specific_goal'.

    CRITICAL: The 'category' MUST be chosen exactly from this list: ["Employment", "Business"].
    Do not invent new categories.

    Make sure your response starts with '```json' and ends with '```' and contains only the JSON object.
    Example: ```json{{"category": "Employment", "specific_goal": "Unemployment benefits"}}```"""

    try:
        response = llm.invoke(system_prompt)
        content = response.content

        try:
            json_match = re.search(r"```json\n(.*)\n```", content, re.DOTALL)
            json_string = json_match.group(1).strip() if json_match else content.strip()
            extracted_data = json.loads(json_string)
        except json.JSONDecodeError:
            return _fallback_intent(current_message)

        category = extracted_data["category"]
        specific_goal = extracted_data["specific_goal"]

        msg_lower = current_message.lower()
        if any(keyword in msg_lower for keyword in ["business", "grant", "startup", "entrepreneur"]):
            category = "Business"

        return {"category": category, "specific_goal": specific_goal}
    except Exception:
        return _fallback_intent(current_message)


def discover_services_node(state: CitizenState) -> dict:
    """Load candidate schemes matching the detected category."""
    user_category = state["category"]

    with sq.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT name, eligibility_criteria, required_documents
            FROM schemes
            WHERE category = ?
            """,
            (user_category,),
        )
        results = cursor.fetchall()

    formatted_services = [
        f"Scheme: {row[0]} | Requires: {row[1]} | Documents: {row[2]}"
        for row in results
    ]
    return {"discovered_services": formatted_services}


def check_documents_node(state: CitizenState) -> dict:
    """Compare required documents to the citizen's current document set."""
    user_documents = ["Aadhaar Card", "PAN Card"]
    required_documents = "Aadhaar Card, Income Certificate".split(", ")

    missing_documents = [doc for doc in required_documents if doc not in user_documents]
    readiness_percentage = int(
        ((len(required_documents) - len(missing_documents)) / len(required_documents)) * 100
    )

    return {
        "readiness_percentage": readiness_percentage,
        "missing_documents": missing_documents,
    }


def should_proceed(state: CitizenState) -> str:
    """Branch to application or cancellation based on the consent flag."""
    return "proceed_to_application" if state.get("user_consent") is True else "stop_workflow"


def cancel_workflow_node(state: CitizenState) -> dict:
    """Return a safe cancellation message when the user declines consent."""
    message = (
        "**Process Halted:** We could not proceed without your consent.\n"
        "**Data Security:** No personal documents were accessed, shared, or stored.\n"
        "**Next Steps:** You can restart the search or explore schemes that do not require these documents."
    )
    return {"agent_response": message}


def application_node(state: CitizenState) -> dict:
    """Final application step for a successfully approved workflow."""
    return {"agent_response": "Application submitted successfully!"}


def consent_node(state: CitizenState) -> dict:
    """Pause the workflow and request user approval before continuing."""
    missing_str = ", ".join(state.get("missing_documents", []))
    return {"agent_response": f"Consent required to continue. Missing documents: {missing_str}"}



workflow = StateGraph(CitizenState)
memory = MemorySaver()

workflow.add_node("detect_intent", detect_intent_node)
workflow.add_node("discover_services", discover_services_node)
workflow.add_node("check_documents", check_documents_node)
workflow.add_node("consent", consent_node)
workflow.add_node("cancel_workflow", cancel_workflow_node)
workflow.add_node("application", application_node)

workflow.add_conditional_edges(
        "consent",
        should_proceed,
        {
            "proceed_to_application": "application",
            "stop_workflow": "cancel_workflow",
        },
    )

workflow.set_entry_point("detect_intent")
workflow.add_edge("detect_intent", "discover_services")
workflow.add_edge("discover_services", "check_documents")
workflow.add_edge("check_documents", "consent")
workflow.add_edge("cancel_workflow", END)
workflow.add_edge("application", END)

compiled_workflow = workflow.compile(
        checkpointer=memory,
        interrupt_before=["consent"],
    )
# ---------------------------------------------------------
# SAMPLE DATA & SCENARIOS
# ---------------------------------------------------------

def run_sample_scenarios():
    print("\n" + "="*50)
    print("SCENARIO 1: Seeking Employment Scheme (Immediate Consent)")
    print("="*50)
    
    config_1 = {"configurable": {"thread_id": "case_001"}}
    initial_state_1 = {
        "user_input": "I am looking for employment support.",
        "user_consent": True
    }
    
    print(f"User Query: {initial_state_1['user_input']}")
    print(f"User Consent Initialized: {initial_state_1['user_consent']}")
    
    final_state_1 = compiled_workflow.invoke(initial_state_1, config_1)
    
    print("\n--- Final State (Interaction 1) ---")
    for key, value in final_state_1.items():
        print(f"{key}: {value}")


    print("\n" + "="*50)
    print("SCENARIO 2: Seeking Business Scheme (Consent Checkpoint)")
    print("="*50)
    
    config_2 = {"configurable": {"thread_id": "case_test_002"}}
    initial_state_2 = {
        "user_input": "I want to apply for the business grant.",
        "user_consent": False
    }
    
    print(f"User Query: {initial_state_2['user_input']}")
    print("Starting workflow...")
    
    # 1. Run the graph (It will pause before the consent node)
    compiled_workflow.invoke(initial_state_2, config_2)
    print("🛑 Workflow Paused at Consent Node")
    
    # 2. Simulate the user clicking "Allow" on the frontend
    print("\nUser clicked Allow. Updating state and resuming workflow...")
    compiled_workflow.update_state(config_2, {"user_consent": True})
    
    # 3. Resume the workflow by invoking with None
    final_state_2 = compiled_workflow.invoke(None, config_2)
    
    print("\n--- Final State (Interaction 2) ---")
    for key, value in final_state_2.items():
        if key in ["user_consent", "agent_response"]:
            print(f"{key}: {value}")


if __name__ == "__main__":
    initialize_database()
    print("Database initialized successfully.")
    
    # Run the test scenarios
    run_sample_scenarios()
    
    # IMPORTANT FUTURE ENDPOINTS TO ADD LATER IN FASTAPI
    # 1. POST /api/v1/intent
    #    - Accepts: {"user_input": "I need unemployment support"}
    #    - Returns: {"category": "Employment", "specific_goal": "..."}
    #
    # 2. GET /api/v1/services
    #    - Accepts a category filter, e.g. ?category=Employment
    #    - Returns the matching government schemes and their requirements
    #
    # 3. POST /api/v1/consent
    #    - Accepts: {"user_consent": true, "thread_id": "case_001"}
    #    - Continues the workflow after the consent checkpoint
    #
    # 4. POST /api/v1/application
    #    - Final submission step for approved applications
    #    - Returns a success or validation response