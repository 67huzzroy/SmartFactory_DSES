from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import pandas as pd
from datetime import datetime

from .models import MachineData, Diagnosis, SimulationRequest, SimulationResult
from .simulator import simulator
from .dss_engine import dss_engine
from .es_engine import es_engine

app = FastAPI(title="Smart Manufacturing Hybrid System")

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for demo purposes
class SystemState:
    def __init__(self):
        self.latest_data: List[MachineData] = []
        self.diagnoses: List[Diagnosis] = []
        self.history = pd.DataFrame()

state = SystemState()

def refresh_system_state():
    """Generates new data and runs analysis"""
    new_data = simulator.get_latest_readings()
    state.latest_data = new_data
    
    # Store history (keep last 24h)
    new_df = pd.DataFrame([d.dict() for d in new_data])
    state.history = pd.concat([state.history, new_df]).tail(500 * 24)
    
    # Run ES on new data
    state.diagnoses = []
    for reading in new_data:
        diags = es_engine.diagnose(reading)
        state.diagnoses.extend(diags)

# Initialize on startup
refresh_system_state()

@app.get("/")
def read_root():
    return {"status": "System Online", "modules": ["Simulator", "DSS", "ES"]}

@app.post("/api/refresh")
def force_refresh():
    """Force data generation step"""
    refresh_system_state()
    return {"status": "Refreshed", "machines_monitored": len(state.latest_data)}

@app.get("/api/dashboard/overview")
def get_overview():
    """Combined view for the dashboard"""
    return {
        "active_machines": len(state.latest_data),
        "active_alerts": len(state.diagnoses),
        "system_health": "Optimal" if len(state.diagnoses) < 5 else "Attention Required"
    }

@app.get("/api/dss/trends")
def get_trends():
    """Get trend analysis from DSS"""
    if state.history.empty:
        return {}
    return dss_engine.analyze_trends(state.history)

@app.get("/api/es/diagnoses", response_model=List[Diagnosis])
def get_diagnoses():
    """Get current active diagnoses"""
    return state.diagnoses

@app.post("/api/dss/simulate", response_model=SimulationResult)
def run_simulation(req: SimulationRequest):
    """Run a what-if scenario"""
    # Find the machine's current state
    machine = next((m for m in state.latest_data if m.machine_id == req.machine_id), None)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
        
    result = dss_engine.run_simulation(req.machine_id, req.parameter, req.value, machine)
    if not result:
        raise HTTPException(status_code=400, detail="Simulation failed")
        
    return result

@app.get("/api/machines", response_model=List[MachineData])
def get_machines(limit: int = 50):
    """Raw machine data"""
    return state.latest_data[:limit]
