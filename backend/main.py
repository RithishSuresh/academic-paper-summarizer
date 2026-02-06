from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
import uvicorn
import shutil
import os

from parsers import PDFParser
from scaledown_client import ScaleDownClient
from rag_engine import RAGEngine
from summarizer import Summarizer

app = FastAPI(title="Academic Paper Summarizer API", version="1.0.0")

# Initialize components
parser = PDFParser()
scaledown = ScaleDownClient()
rag = RAGEngine()
summarizer = Summarizer()

# In-memory store for paper metadata (in a real app, use a DB)
papers_db = {}

class SummaryRequest(BaseModel):
    level: str = "technical"  # eli5, technical, expert

@app.get("/")
async def root():
    return {"message": "Academic Paper Summarizer API is running"}

@app.post("/upload")
async def upload_paper(file: UploadFile = File(...)):
    """
    Uploads a PDF, parses it, compresses sections using ScaleDown, and indexes them.
    """
    try:
        content = await file.read()
        paper_id = str(uuid.uuid4())
        
        # 1. Parse
        sections = parser.parse_pdf(content)
        metadata = parser.extract_metadata(content)
        
        # 2. Compress & Index
        compressed_sections = {}
        for name, text in sections.items():
            compressed_text = await scaledown.compress_section(text)
            compressed_sections[name] = compressed_text
        
        # 3. RAG Indexing
        rag.add_paper_sections(paper_id, compressed_sections)
        
        # Store metadata
        papers_db[paper_id] = {
            "title": metadata.get("title", file.filename),
            "original_sections": sections, # Keeping original for reference if needed
            "compressed_sections": compressed_sections,
            "filename": file.filename
        }
        
        return {
            "id": paper_id, 
            "title": papers_db[paper_id]["title"],
            "stats": scaledown.get_stats()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/summarize/{paper_id}")
async def get_summary(paper_id: str, level: str = "technical"):
    if paper_id not in papers_db:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    paper = papers_db[paper_id]
    context = paper["compressed_sections"]
    
    summary = summarizer.generate_summary(context, level)
    
    return {
        "paper_id": paper_id,
        "level": level,
        "summary": summary
    }

@app.get("/papers")
async def list_papers():
    return [{"id": pid, "title": data["title"]} for pid, data in papers_db.items()]
