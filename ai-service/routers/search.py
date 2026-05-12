from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from services.rag import rag_search

router = APIRouter()


class SearchRequest(BaseModel):
    query: str
    courseId: Optional[str] = None
    topK: int = 5


class SearchResult(BaseModel):
    answer: str
    sources: List[str]
    relevantChunks: List[str]


@router.post("/", response_model=SearchResult)
async def semantic_search(req: SearchRequest):
    result = await rag_search(req.query, req.courseId, req.topK)
    return result
