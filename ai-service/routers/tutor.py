from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from services.llm import get_llm_response

router = APIRouter()


class Message(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class TutorRequest(BaseModel):
    question: str
    courseId: Optional[str] = None
    courseContext: Optional[str] = None
    history: Optional[List[Message]] = []


class TutorResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []


@router.post("/ask", response_model=TutorResponse)
async def ask_tutor(req: TutorRequest):
    system_prompt = """You are an expert AI tutor for an enterprise learning platform.
    Answer questions clearly, concisely, and helpfully.
    If course context is provided, use it to give more specific answers.
    Break down complex topics into understandable steps."""

    if req.courseContext:
        system_prompt += f"\n\nCourse Context:\n{req.courseContext}"

    messages = [{"role": m.role, "content": m.content} for m in req.history]
    messages.append({"role": "user", "content": req.question})

    answer = await get_llm_response(system_prompt, messages)
    return TutorResponse(answer=answer)
