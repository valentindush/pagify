from fastapi import FastAPI
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
import os

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_PROJECT"] = "pr-warmhearted-pamphlet-96"

app = FastAPI()

class Summarize(BaseModel):
    content: str

@app.get("/")
def read_root():
    return {"Page": "Summarize"}

@app.post("/summarize")
def summarize(summ: Summarize):
    llm = ChatOpenAI()
    llm.invoke("Hello, world!")
    return {"Content": summ.content}