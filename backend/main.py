from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

# Load .env variables if running locally
load_dotenv()

# Configure OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/")
def health_check():
    return {"status": "Backend is alive!"}

# Request model for POST body
class PromptRequest(BaseModel):
    prompt: str

# Main generation endpoint
@app.post("/api/generate")
async def generate_document(data: PromptRequest):
    try:
        print("Received prompt:", data.prompt)

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
        print("Generated output:", output[:100], "...")  # Print first 100 chars

        return {"output": output}

    except Exception as e:
        print("Error during OpenAI call:", e)
        return {"error": str(e)}
