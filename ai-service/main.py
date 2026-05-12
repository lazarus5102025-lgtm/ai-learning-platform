from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import tutor, quiz, search, documents

load_dotenv()

app = FastAPI(
    title="AI Learning Platform - AI Service",
    description="Handles AI Tutor, Quiz Generation, RAG Search, and Document Processing",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(tutor.router, prefix="/tutor", tags=["AI Tutor"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz Generation"])
app.include_router(search.router, prefix="/search", tags=["RAG Search"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}
