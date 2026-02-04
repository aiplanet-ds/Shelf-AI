from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import re
import uuid
import os
from cerebras.cloud.sdk import Cerebras
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

# Initialize Cerebras client
cerebras_client = Cerebras(
    api_key=os.environ.get("CEREBRAS_API_KEY")
)

# System prompt for the AI agent
SYSTEM_PROMPT = """You are a professional wire shelf designer assistant working for a premium shelving company. Your role is to engage customers in natural, friendly conversation to understand their wire shelf requirements and extract key entities needed for design.

You should behave like an experienced designer talking to a customer, asking clarifying questions and providing helpful suggestions. Always maintain a professional yet approachable tone.

WIRE SHELF CONFIGURATION SCHEMA:
{
  "size_and_capacity": {
    "width": {
      "value": null,
      "unit": "inches",
      "description": "Width of the shelf unit",
      "required": true
    },
    "length": {
      "value": null,
      "unit": "inches",
      "description": "Depth/Length of the shelf unit",
      "required": true
    },
    "post_height": {
      "value": null,
      "unit": "inches",
      "description": "Height of the posts (related to number of shelves)",
      "required": true
    },
    "number_of_shelves": {
      "value": null,
      "unit": "count",
      "description": "Number of shelf levels (related to post height)",
      "required": true
    }
  },
  "styles_and_finishes": {
    "shelf_style": {
      "value": null,
      "options": ["Industrial Grid", "Commercial Wire", "Heavy Duty Mesh", "Ventilated Wire", "Open Grid Pro"],
      "description": "Style of the wire shelving",
      "required": false
    },
    "solid_bottom_shelf": {
      "value": false,
      "type": "boolean",
      "description": "Whether to include a solid bottom shelf",
      "required": false
    },
    "color_and_finish": {
      "value": null,
      "options": ["Chrome", "Stainless Steel", "Black Epoxy", "White Epoxy", "Zinc Plated"],
      "description": "Color and finish of the shelving",
      "required": false
    },
    "type_of_posts": {
      "value": null,
      "options": ["Stationary", "Mobile"],
      "description": "Whether posts are stationary or mobile",
      "required": false
    }
  },
  "accessories": {
    "shelf_dividers": {
      "number_of_dividers": {
        "value": null,
        "type": "integer",
        "description": "Number of dividers per shelf (creates sections)",
        "required": false
      },
      "shelves_to_apply_this_to": {
        "value": null,
        "type": "array",
        "description": "Which shelf levels to add dividers to (e.g., [1, 2, 3] for top 3 shelves)",
        "required": false
      }
    },
    "enclosure_panels": {
      "enclosure_type": {
        "value": null,
        "options": ["none", "top", "sides"],
        "description": "Type of enclosure panels - 'top' adds panel at top, 'sides' adds panels to three sides",
        "required": false
      }
    }
  }
}

IMPORTANT RULES:
1. The "size_and_capacity" entities (width, length, post_height, number_of_shelves) are ESSENTIAL. The 3D model can only be built when ALL 4 essential entities are collected.
2. The "styles_and_finishes" entities are OPTIONAL and can be configured later.
3. Always ask clarifying questions naturally, like a designer would.
4. If a user provides partial information, acknowledge what they've given and ask for the missing essential details.
5. Provide helpful suggestions based on common use cases (garage storage, pantry, office, etc.).
6. ALWAYS respond with your natural conversation followed by a JSON object.

RESPONSE FORMAT:
Your response should ALWAYS end with a JSON object in this exact format:
```json
{
  "extracted_entities": {
    "width": value_or_null,
    "length": value_or_null,
    "post_height": value_or_null,
    "number_of_shelves": value_or_null,
    "shelf_style": value_or_null,
    "solid_bottom_shelf": boolean_or_null,
    "color_and_finish": value_or_null,
    "type_of_posts": value_or_null,
    "shelf_dividers_count": value_or_null,
    "shelf_dividers_shelves": array_or_null,
    "enclosure_type": value_or_null
  },
  "has_sufficient_entities": boolean,
  "next_questions": [array_of_follow_up_questions]
}
```

Example conversation:
User: "I need a shelf for my garage"
Assistant: "Great! A garage shelf is a popular choice. To design the perfect shelving unit for your garage, I'll need to understand your space and storage needs.

Could you tell me:
- How wide should the shelf be? (in inches)
- How deep do you need it? (in inches)
- How tall should it be?
- How many shelf levels would work best for your storage?

What are you planning to store on it? That can help me recommend the right dimensions and style."

```json
{
  "extracted_entities": {
    "width": null,
    "length": null,
    "post_height": null,
    "number_of_shelves": null,
    "shelf_style": null,
    "solid_bottom_shelf": null,
    "color_and_finish": null,
    "type_of_posts": null
  },
  "has_sufficient_entities": false,
  "next_questions": ["What width do you need?", "How deep should it be?", "What height works for your space?", "How many shelf levels do you want?"]
}
```"""

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://shelf-ai.tryaiplanet.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for chat sessions
chat_sessions = {}
chat_histories = {}

class ChatMessage(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    extracted_entities: Dict[str, Any]
    has_sufficient_entities: bool
    next_questions: List[str]

@app.get("/")
async def root():
    return {"message": "Wire Shelves 3D Configurator API"}

@app.get("/api/")
async def api_root():
    return {"message": "Wire Shelves 3D Configurator API"}

@app.post("/api/chat")
async def chat_with_ai(chat_request: ChatMessage):
    try:
        session_id = chat_request.session_id
        user_message = chat_request.message
        
        # Initialize chat history if not exists
        if session_id not in chat_histories:
            chat_histories[session_id] = []

        # Get or initialize session entities
        if session_id not in chat_sessions:
            chat_sessions[session_id] = {
                "width": None,
                "length": None,
                "post_height": None,
                "number_of_shelves": None,
                "shelf_style": None,
                "solid_bottom_shelf": None,
                "color_and_finish": None,
                "type_of_posts": None,
                "shelf_dividers_count": None,
                "shelf_dividers_shelves": None,
                "enclosure_type": None
            }

        # Prepare conversation history for Cerebras
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add previous conversation history
        for msg in chat_histories[session_id]:
            if msg["type"] == "user":
                messages.append({"role": "user", "content": msg["content"]})
            else:
                # Only add the conversational part, not the JSON
                clean_content = clean_ai_response(msg["content"])
                messages.append({"role": "assistant", "content": clean_content})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Call Cerebras API
        completion_response = cerebras_client.chat.completions.create(
            messages=messages,
            model="llama-4-scout-17b-16e-instruct",
            stream=False,
            max_completion_tokens=4916,
            temperature=0,
            top_p=0.5
        )

        ai_response = completion_response.choices[0].message.content
        
        # Store message history
        chat_histories[session_id].append({"type": "user", "content": user_message})
        chat_histories[session_id].append({"type": "ai", "content": ai_response})

        # Extract entities and sufficient status from AI response
        extracted_entities, has_sufficient, next_questions = parse_ai_response(ai_response, session_id)

        # Update session entities
        chat_sessions[session_id].update(extracted_entities)

        # Clean the response (remove the JSON part)
        clean_response = clean_ai_response(ai_response)

        return ChatResponse(
            response=clean_response,
            extracted_entities=extracted_entities,
            has_sufficient_entities=has_sufficient,
            next_questions=next_questions
        )
        
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

def parse_ai_response(response: str, session_id: str) -> tuple[Dict[str, Any], bool, List[str]]:
    """Parse AI response to extract JSON data"""
    # Try to extract JSON from the response
    json_match = re.search(r'```json\s*(\{.*?\})\s*```', response, re.DOTALL)
    if not json_match:
        # Fallback: look for JSON without code blocks
        json_match = re.search(r'(\{[^{}]*"extracted_entities"[^{}]*\})', response, re.DOTALL)

    if json_match:
        try:
            json_data = json.loads(json_match.group(1))
            extracted_entities = json_data.get("extracted_entities", {})
            has_sufficient = json_data.get("has_sufficient_entities", False)
            next_questions = json_data.get("next_questions", [])

            # Convert to the format expected by frontend
            formatted_entities = {}
            if extracted_entities.get("width"):
                formatted_entities["width"] = extracted_entities["width"]
            if extracted_entities.get("length"):
                formatted_entities["length"] = extracted_entities["length"]
            if extracted_entities.get("post_height"):
                formatted_entities["postHeight"] = extracted_entities["post_height"]
            if extracted_entities.get("number_of_shelves"):
                formatted_entities["numberOfShelves"] = extracted_entities["number_of_shelves"]
            if extracted_entities.get("shelf_style"):
                formatted_entities["shelfStyle"] = extracted_entities["shelf_style"]
            if extracted_entities.get("solid_bottom_shelf") is not None:
                formatted_entities["solidBottomShelf"] = extracted_entities["solid_bottom_shelf"]
            if extracted_entities.get("color_and_finish"):
                formatted_entities["color"] = extracted_entities["color_and_finish"]
            if extracted_entities.get("type_of_posts"):
                formatted_entities["postType"] = extracted_entities["type_of_posts"]
            if extracted_entities.get("shelf_dividers_count"):
                formatted_entities["shelfDividersCount"] = extracted_entities["shelf_dividers_count"]
            if extracted_entities.get("shelf_dividers_shelves"):
                formatted_entities["shelfDividersShelves"] = extracted_entities["shelf_dividers_shelves"]
            if extracted_entities.get("enclosure_type"):
                formatted_entities["enclosureType"] = extracted_entities["enclosure_type"]

            return formatted_entities, has_sufficient, next_questions
        except json.JSONDecodeError:
            pass

    # Fallback: extract from natural language
    return extract_from_natural_language(response), False, []

def extract_from_natural_language(text: str) -> Dict[str, Any]:
    """Extract entities from natural language as fallback"""
    entities = {}
    text_lower = text.lower()

    # Extract dimensions
    width_match = re.search(r'(\d+)\s*(?:inch|inches|in|"|''|′)?\s*(?:wide|width)', text_lower)
    if width_match:
        entities['width'] = int(width_match.group(1))

    length_match = re.search(r'(\d+)\s*(?:inch|inches|in|"|''|′)?\s*(?:long|length|deep|depth)', text_lower)
    if length_match:
        entities['length'] = int(length_match.group(1))

    height_match = re.search(r'(\d+)\s*(?:inch|inches|in|"|''|′)?\s*(?:tall|high|height)', text_lower)
    if height_match:
        entities['postHeight'] = int(height_match.group(1))

    shelves_match = re.search(r'(\d+)\s*(?:shelf|shelves|level|levels|tier|tiers)', text_lower)
    if shelves_match:
        entities['numberOfShelves'] = int(shelves_match.group(1))

    return entities

def check_sufficient_entities(entities: Dict[str, Any]) -> bool:
    """Check if we have all required entities for 3D model"""
    required = ['width', 'length', 'postHeight', 'numberOfShelves']
    return all(key in entities and entities[key] is not None for key in required)

def clean_ai_response(response: str) -> str:
    """Remove the JSON part from response"""
    # Remove JSON code blocks
    cleaned = re.sub(r'```json.*?```', '', response, flags=re.DOTALL)
    # Remove standalone JSON objects
    cleaned = re.sub(r'\{[^{}]*"extracted_entities"[^{}]*\}', '', cleaned, flags=re.DOTALL)

    return cleaned.strip()

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    return chat_histories.get(session_id, [])

@app.delete("/api/chat/{session_id}")
async def clear_chat_session(session_id: str):
    """Clear a chat session"""
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    if session_id in chat_histories:
        del chat_histories[session_id]

    return {"message": "Session cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
