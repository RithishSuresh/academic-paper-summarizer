# Academic Paper Summarizer – Project Documentation

## Overview
This project is an AI-powered academic paper summarization tool built using Retrieval-Augmented Generation (RAG).

## Tech Stack
- Frontend: React + Vite
- Backend: FastAPI (Python)
- AI: Transformers, Sentence-Transformers
- Optimization: ScaleDown API

## Key Features
- Upload or URL-based academic paper input
- Section-aware parsing (Abstract, Methods, Results)
- Multi-level summaries (ELI5, Technical, Expert)
- Faster processing using ScaleDown

## How to Run
1. Start backend: `uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Open browser and use the app

## Future Scope
- ROUGE score comparison
- Literature review generator
- Multi-paper comparative analysis
