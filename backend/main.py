from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/generate")
async def generate_document(data: PromptRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a curriculum design expert generating structured and printable documents aligned to the Victorian Digital Technologies Curriculum version 2.0."
                },
                {
                    "role": "user",
                    "content": data.prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )
        output = response["choices"][0]["message"]["content"]
        return {"output": output}
    except Exception as e:
        return {"error": str(e)}
