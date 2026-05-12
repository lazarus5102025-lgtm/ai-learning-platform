import os
from typing import Optional
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from services.llm import get_llm_response

PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

embeddings = OpenAIEmbeddings()


def get_vectorstore(collection_name: str = "default"):
    return Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=PERSIST_DIR,
    )


async def ingest_document(contents: bytes, filename: str, courseId: Optional[str] = None) -> dict:
    """Parse PDF bytes, split into chunks, embed and store in ChromaDB."""
    import tempfile

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    collection = courseId or "global"
    vectorstore = get_vectorstore(collection)
    vectorstore.add_documents(chunks)
    vectorstore.persist()

    os.unlink(tmp_path)
    return {"chunks": len(chunks)}


async def rag_search(query: str, courseId: Optional[str] = None, top_k: int = 5) -> dict:
    """Semantic search + RAG answer generation."""
    collection = courseId or "global"
    vectorstore = get_vectorstore(collection)

    results = vectorstore.similarity_search(query, k=top_k)
    if not results:
        return {"answer": "No relevant documents found.", "sources": [], "relevantChunks": []}

    context = "\n\n".join([doc.page_content for doc in results])
    sources = list({doc.metadata.get("source", "Unknown") for doc in results})
    chunks = [doc.page_content[:200] for doc in results]

    system = "You are a helpful knowledge assistant. Answer questions using ONLY the provided context."
    user_msg = f"Context:\n{context}\n\nQuestion: {query}"

    answer = await get_llm_response(system, [{"role": "user", "content": user_msg}])

    return {"answer": answer, "sources": sources, "relevantChunks": chunks}
