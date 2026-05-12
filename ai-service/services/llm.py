import os
from openai import AsyncOpenAI

_client = None


def get_client():
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


async def get_llm_response(system_prompt: str, messages: list, model: str = "gpt-4o-mini") -> str:
    """
    Unified LLM call. Supports OpenAI (default).
    Extend with Gemini by checking AI_PROVIDER env var.
    """
    provider = os.getenv("AI_PROVIDER", "openai")

    if provider == "openai":
        client = get_client()
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "system", "content": system_prompt}] + messages,
            temperature=0.7,
            max_tokens=1500,
        )
        return response.choices[0].message.content

    elif provider == "gemini":
        # Gemini integration placeholder
        # from google.generativeai import GenerativeModel
        # model = GenerativeModel("gemini-pro")
        # response = model.generate_content(...)
        raise NotImplementedError("Gemini provider not yet configured")

    raise ValueError(f"Unknown AI provider: {provider}")
