from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from services.rag import ingest_document

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    courseId: Optional[str] = Form(None),
):
    contents = await file.read()
    result = await ingest_document(contents, file.filename, courseId)
    return {"message": "Document ingested", "chunks": result.get("chunks", 0)}
