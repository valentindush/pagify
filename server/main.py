from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils.langchain_helper import summarize_webpage

app = FastAPI()

class Summarize(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"Page": "Summarize"}

@app.post("/summarize")
def summarize(summ: Summarize):
    try:
        result = summarize_webpage(summ.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))