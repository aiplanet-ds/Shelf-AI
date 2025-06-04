from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import re
import uuid
# Mock implementation for emergentintegrations
class UserMessage:
    def __init__(self, text):
        self.text = text

class LlmChat:
    def __init__(self, api_key, session_id, system_message):
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message
        self.model = None

    def with_model(self, provider, model_name):
        self.model = f"{provider}:{model_name}"
        return self

    async def send_message(self, user_message):
        # Mock AI response for testing
        return f"""Thank you for your message: "{user_message.text}"

I'm here to help you design the perfect wire shelving unit! To create your 3D model, I need to know:

1. Width (how wide should it be?)
2. Length/Depth (how deep should it be?)
3. Height (how tall should it be?)
4. Number of shelves (how many shelf levels?)

Could you tell me about your storage needs and the space you're working with?

ENTITIES_EXTRACTED: {{"message_received": true}}
SUFFICIENT: false"""

import asyncio

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        
        # Initialize chat session if not exists
        if session_id not in chat_sessions:
            system_message = """You are a professional wire shelf designer assistant. Your role is to engage customers in natural conversation to understand their wire shelf requirements and extract key entities needed for design.

Key entities to extract (mark as EXTRACTED when found):
- Width: shelf width in inches (REQUIRED for 3D model)
- Length: shelf depth/length in inches (REQUIRED for 3D model) 
- PostHeight: overall height in inches (REQUIRED for 3D model)
- NumberOfShelves: how many shelf levels (REQUIRED for 3D model)
- Color: finish color (Chrome, Black, White, Stainless Steel, Bronze)
- ShelfStyle: style name (Industrial Grid, Metro Classic, Commercial Pro, Heavy Duty)
- SolidBottomShelf: boolean for solid bottom shelf
- PostType: Stationary or Mobile

CONVERSATION FLOW:
1. Start with friendly greeting and ask about storage needs
2. Extract the 4 REQUIRED entities: Width, Length, PostHeight, NumberOfShelves
3. Only when all 4 are collected, mention "I have enough information to create your 3D model"
4. Then gather optional details: Color, ShelfStyle, SolidBottomShelf, PostType
5. Be conversational like a designer talking to a customer
6. Ask clarifying questions naturally
7. Extract numbers and dimensions from natural language

RESPONSE FORMAT:
Always end your response with:
ENTITIES_EXTRACTED: {json object with extracted entities}
SUFFICIENT: {true/false if all 4 required entities collected}"""

            chat_sessions[session_id] = LlmChat(
                api_key="AIzaSyAO9cDR-FTZIlWgLIRPEycp0JkpuOLGIQI",
                session_id=session_id,
                system_message=system_message
            ).with_model("gemini", "gemini-2.0-flash")
            
            chat_histories[session_id] = []

        # Get chat instance
        chat = chat_sessions[session_id]
        
        # Send message to AI
        user_msg = UserMessage(text=user_message)
        ai_response = await chat.send_message(user_msg)
        
        # Store message history
        chat_histories[session_id].append({"type": "user", "content": user_message})
        chat_histories[session_id].append({"type": "ai", "content": ai_response})
        
        # Extract entities and sufficient status from AI response
        extracted_entities = extract_entities_from_response(ai_response, session_id)
        has_sufficient = check_sufficient_entities(extracted_entities)
        
        # Clean the response (remove the ENTITIES_EXTRACTED part)
        clean_response = clean_ai_response(ai_response)
        
        return ChatResponse(
            response=clean_response,
            extracted_entities=extracted_entities,
            has_sufficient_entities=has_sufficient,
            next_questions=generate_next_questions(extracted_entities, has_sufficient)
        )
        
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

def extract_entities_from_response(response: str, session_id: str) -> Dict[str, Any]:
    """Extract entities from AI response and maintain session state"""
    # Get existing entities for this session
    existing_entities = getattr(extract_entities_from_response, f'entities_{session_id}', {})
    
    # Try to extract from the structured response
    entities_match = re.search(r'ENTITIES_EXTRACTED:\s*(\{.*\})', response, re.IGNORECASE | re.DOTALL)
    if entities_match:
        try:
            new_entities = json.loads(entities_match.group(1))
            existing_entities.update(new_entities)
        except json.JSONDecodeError:
            pass
    
    # Also extract from natural language in the response
    text = response.lower()
    
    # Extract dimensions
    width_match = re.search(r'(\d+)\s*(?:inch|inches|in|"|''|′)?\s*(?:wide|width)', text)
    if width_match:
        existing_entities['width'] = int(width_match.group(1))
    
    length_match = re.search(r'(\d+)\s*(?:inch|inches|in|"|''|′)?\s*(?:long|length|deep|depth)', text)
    if length_match:
        existing_entities['length'] = int(length_match.group(1))
    
    height_match = re.search(r'(\d+)\s*(?:inch|inches|in|"|''|′)?\s*(?:tall|high|height)', text)
    if height_match:
        existing_entities['postHeight'] = int(height_match.group(1))
    
    shelves_match = re.search(r'(\d+)\s*(?:shelf|shelves|level|levels|tier|tiers)', text)
    if shelves_match:
        existing_entities['numberOfShelves'] = int(shelves_match.group(1))
    
    # Extract colors
    colors = ['chrome', 'black', 'white', 'stainless steel', 'bronze']
    for color in colors:
        if color in text:
            existing_entities['color'] = color.title()
    
    # Extract styles
    styles = ['industrial grid', 'metro classic', 'commercial pro', 'heavy duty']
    for style in styles:
        if style in text:
            existing_entities['shelfStyle'] = style.title()
    
    # Extract post type
    if 'mobile' in text or 'caster' in text or 'wheel' in text:
        existing_entities['postType'] = 'Mobile'
    elif 'stationary' in text or 'fixed' in text:
        existing_entities['postType'] = 'Stationary'
    
    # Extract solid bottom shelf
    if 'solid bottom' in text or 'solid shelf' in text:
        existing_entities['solidBottomShelf'] = True
    elif 'wire bottom' in text or 'no solid' in text:
        existing_entities['solidBottomShelf'] = False
    
    # Store entities for this session
    setattr(extract_entities_from_response, f'entities_{session_id}', existing_entities)
    
    return existing_entities

def check_sufficient_entities(entities: Dict[str, Any]) -> bool:
    """Check if we have all required entities for 3D model"""
    required = ['width', 'length', 'postHeight', 'numberOfShelves']
    return all(key in entities and entities[key] is not None for key in required)

def clean_ai_response(response: str) -> str:
    """Remove the ENTITIES_EXTRACTED and SUFFICIENT parts from response"""
    # Remove ENTITIES_EXTRACTED section
    cleaned = re.sub(r'ENTITIES_EXTRACTED:.*$', '', response, flags=re.IGNORECASE | re.DOTALL)
    cleaned = re.sub(r'SUFFICIENT:.*$', '', cleaned, flags=re.IGNORECASE | re.DOTALL)
    
    return cleaned.strip()

def generate_next_questions(entities: Dict[str, Any], has_sufficient: bool) -> List[str]:
    """Generate helpful next questions based on current state"""
    if has_sufficient:
        questions = []
        if 'color' not in entities:
            questions.append("What color/finish would you prefer?")
        if 'shelfStyle' not in entities:
            questions.append("Do you have a preference for shelf style?")
        if 'solidBottomShelf' not in entities:
            questions.append("Would you like a solid bottom shelf?")
        if 'postType' not in entities:
            questions.append("Do you need this to be mobile with casters?")
        
        if not questions:
            questions.append("Is there anything you'd like to adjust about your shelving unit?")
        
        return questions
    else:
        missing = []
        if 'width' not in entities:
            missing.append("How wide should it be?")
        if 'length' not in entities:
            missing.append("How deep/long should it be?")
        if 'postHeight' not in entities:
            missing.append("How tall should it be?")
        if 'numberOfShelves' not in entities:
            missing.append("How many shelves do you need?")
        
        return missing

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
    # Clear stored entities
    if hasattr(extract_entities_from_response, f'entities_{session_id}'):
        delattr(extract_entities_from_response, f'entities_{session_id}')
    
    return {"message": "Session cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
