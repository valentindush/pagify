import os
from langchain_groq import ChatGroq
from langchain_community.document_loaders import WebBaseLoader
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from langchain.prompts import PromptTemplate
from typing import List
import json

assert "GROQ_API_KEY" in os.environ, "GROQ_API_KEY not found in environment variables"

class WebPageSummary(BaseModel):
    title: str = Field(description="A concise title for the web page content.")
    summary: str = Field(description="A brief summary of the web page content.")
    key_points: List[str] = Field(description="A list of 3-5 key points to highlight in the web page content.")

def summarize_webpage(url: str) -> dict:
    # Initialize LLM
    llm = ChatGroq(
        model="mixtral-8x7b-32768",
        temperature=0.6,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

    # Load webpage content
    loader = WebBaseLoader(url)
    document = loader.load()[0]

    # Set up output parser
    parser = PydanticOutputParser(pydantic_object=WebPageSummary)

    # Create prompt template
    prompt_template = """
    Analyze the following web-page content and provide a structured summary.

    {format_instructions}

    Text: {text}
    """
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    # Create and run chain
    chain = LLMChain(llm=llm, prompt=prompt)
    result = chain.run(document.page_content)

    # Parse and return result
    parsed_result = parser.parse(result)
    return parsed_result.model_dump(exclude_none=True)