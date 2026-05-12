import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from services.llm import get_llm_response

router = APIRouter()


class QuizGenerateRequest(BaseModel):
    courseId: str
    numQuestions: int = 5
    topic: Optional[str] = None
    documentText: Optional[str] = None


class MCQOption(BaseModel):
    label: str
    text: str


class MCQQuestion(BaseModel):
    id: str
    question: str
    options: List[MCQOption]
    correctAnswer: str
    explanation: str


class QuizGenerateResponse(BaseModel):
    quizId: str
    questions: List[MCQQuestion]


@router.post("/generate", response_model=QuizGenerateResponse)
async def generate_quiz(req: QuizGenerateRequest):
    context = req.documentText or ""
    topic_line = f"Topic: {req.topic}" if req.topic else ""

    prompt = f"""Generate {req.numQuestions} multiple-choice questions.
{topic_line}
{f"Based on this content: {context[:3000]}" if context else ""}

Return ONLY valid JSON in this exact format:
{{
  "questions": [
    {{
      "id": "q1",
      "question": "Question text here?",
      "options": [
        {{"label": "A", "text": "Option A"}},
        {{"label": "B", "text": "Option B"}},
        {{"label": "C", "text": "Option C"}},
        {{"label": "D", "text": "Option D"}}
      ],
      "correctAnswer": "A",
      "explanation": "Brief explanation why A is correct"
    }}
  ]
}}"""

    system = "You are a quiz generation expert. Always return valid JSON only, no markdown."
    response = await get_llm_response(system, [{"role": "user", "content": prompt}])

    try:
        data = json.loads(response)
        questions = [MCQQuestion(**q) for q in data["questions"]]
    except Exception:
        questions = []

    import uuid
    quiz_id = str(uuid.uuid4())
    return QuizGenerateResponse(quizId=quiz_id, questions=questions)


class SubmitRequest(BaseModel):
    answers: dict  # {"q1": "A", "q2": "C", ...}


@router.post("/{quizId}/evaluate")
async def evaluate_quiz(quizId: str, req: SubmitRequest):
    # In production, fetch stored quiz from DB and compare
    return {
        "quizId": quizId,
        "score": 0,
        "total": len(req.answers),
        "message": "Evaluation complete",
    }
