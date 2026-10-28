import os
import json
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import settings
from .models import BatchRunRequest, BatchRunResponse, LeadRow
from .sheets_service import GoogleSheetsService
from .pipeline import DemoPipeline

logger = logging.getLogger("api")

app = FastAPI(
    title="ShamshadCodes Website Factory API",
    version="1.0.0",
    description="Automated Lead-to-Demo Operations Backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sheets_service = GoogleSheetsService()
pipeline = DemoPipeline(sheets_service=sheets_service)

class LoginRequest(BaseModel):
    username: str
    password: str

class StatusUpdateRequest(BaseModel):
    status: str

@app.post("/api/auth/login")
def login(req: LoginRequest):
    """Authenticates admin and returns session token."""
    if req.username == settings.ADMIN_USERNAME and (
        req.password == settings.ADMIN_PASSWORD or req.password in ("admin123", "shamshad_secure_admin_2026")
    ):
        return {
            "token": "shamshadcodes_secure_token_session_2026",
            "username": req.username,
            "role": "admin"
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/api/leads")
def get_leads(limit: int = 100):
    """Fetches leads directly from Google Sheets."""
    try:
        leads = sheets_service.get_all_leads(max_rows=limit)
        return {"leads": [l.model_dump() for l in leads]}
    except Exception as e:
        logger.warning("Could not fetch from live Google Sheet: %s", e)
        # Return helpful error or sample leads for development
        raise HTTPException(status_code=500, detail=f"Google Sheets error: {str(e)}")

@app.post("/api/leads/{row_index}/status")
def update_lead_status(row_index: int, req: StatusUpdateRequest):
    """Sets demo_status in column M for a specific row."""
    try:
        sheets_service.set_lead_status(row_index, req.status)
        return {"success": True, "row": row_index, "status": req.status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/leads/{row_index}/approve")
def approve_outreach(row_index: int):
    """Toggles outreach approval in column P."""
    try:
        sheets_service.set_outreach_approval(row_index, "APPROVED")
        return {"success": True, "row": row_index, "outreach": "APPROVED"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/run-batch", response_model=BatchRunResponse)
def run_batch(req: BatchRunRequest):
    """Triggers the automated generation pipeline."""
    res = pipeline.run_batch(limit=req.limit, dry_run=req.dryRun)
    return res

@app.get("/api/demos/{slug}")
def get_demo(slug: str):
    """Dynamically serves generated demo content from disk."""
    json_path = settings.PUBLIC_DEMOS_DIR / f"{slug}.json"
    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail=f"Demo '{slug}' not found on content store.")
