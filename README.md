# Shelf-AI: 3D Wire Shelves Configurator

A professional-grade 3D wire shelf configurator with AI-powered design assistance. This application combines React Three.js 3D visualization with FastAPI backend and intelligent entity extraction for natural language shelf configuration.

## 🏗️ Repository Structure

```
Shelf-AI/
├── backend/                    # FastAPI Backend Service
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── external_integrations/ # External service integrations
├── frontend/                  # React Frontend Application
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Premium styling system
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration
├── scripts/                   # Deployment and utility scripts
│   └── update-and-start.sh   # Service management script
├── tests/                     # Test suites
├── .devcontainer/            # Development container configuration
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # Container orchestration
├── nginx.conf                # Nginx reverse proxy configuration
├── entrypoint.sh             # Container startup script
└── README.md                 # This file
```

## 🔧 Technical Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Uvicorn ASGI server
- **AI Integration**: Mock implementation for emergentintegrations (LLM chat)
- **Entity Extraction**: Natural language processing for shelf parameters
- **Session Management**: In-memory chat session storage
- **CORS**: Configured for cross-origin requests from React frontend

### Frontend (React)
- **3D Engine**: Three.js for photorealistic 3D rendering
- **UI Framework**: React with Tailwind CSS
- **State Management**: React hooks for component state
- **HTTP Client**: Axios for API communication
- **Styling**: Premium CSS design system with CSS variables

### Key Components

#### 1. WireShelf3D Component (`frontend/src/App.js`)
```javascript
// 3D visualization with premium materials and lighting
- PerspectiveCamera (1200x800 viewport)
- WebGL renderer with antialiasing
- Physical-based materials (metalness, roughness, clearcoat)
- Dynamic lighting system (ambient, directional, rim, fill)
- Style-specific wire patterns
- Mobile caster support
- Real-time parameter updates
```

#### 2. ChatInterface Component (`frontend/src/App.js`)
```javascript
// AI-powered chat interface
- Session-based conversation management
- Real-time entity extraction
- Message history persistence
- Loading states and error handling
- Responsive design with premium styling
```

#### 3. ParameterControls Component (`frontend/src/App.js`)
```javascript
// Configuration panel for shelf parameters
- Required parameters: width, length, height, shelves
- Optional parameters: color, style, bottom shelf, post type
- Real-time 3D model updates
- Form validation and user feedback
```

#### 4. Backend API Endpoints (`backend/server.py`)
```python
# FastAPI REST API
POST /api/chat              # AI chat interaction
GET  /api/chat/history/{id} # Retrieve chat history
DELETE /api/chat/{id}       # Clear chat session
GET  /                      # Health check
GET  /api/                  # API health check
```

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **Python**: 3.10 or higher
- **npm/yarn**: Latest stable version
- **Git**: For repository cloning

### Optional (for Docker deployment)
- **Docker**: v20.0.0 or higher
- **Docker Compose**: v2.0.0 or higher

## 🚀 Installation & Setup

### Method 1: Local Development Setup (Recommended)

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Shelf-AI
```

#### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Note: emergentintegrations is mocked in the current implementation
# The application will run with a mock AI chat interface
```

#### Step 3: Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install
# or if you prefer yarn:
# yarn install
```

#### Step 4: Environment Configuration
```bash
# Backend environment (backend/.env)
# Create .env file in backend directory if needed
# Currently no environment variables required for basic setup

# Frontend environment (frontend/.env)
# Create .env file in frontend directory
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
```

### Method 2: Docker Setup

#### Prerequisites Check
```bash
# Verify Docker installation
docker --version
docker-compose --version
```

#### Docker Build & Run
```bash
# Build and start all services
docker-compose up --build

# Or for detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🏃‍♂️ Running the Application

### Local Development Mode

#### Terminal 1: Start Backend Server
```bash
cd backend

# Activate virtual environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Start FastAPI server
python server.py

# Server will start on http://localhost:8000
# API documentation available at http://localhost:8000/docs
```

#### Terminal 2: Start Frontend Development Server
```bash
cd frontend

# Start React development server
npm start
# or: yarn start

# Application will open at http://localhost:3000
# Hot reload enabled for development
```

### Production Mode

#### Using Docker (Recommended for Production)
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build

# Or use the provided Dockerfile for custom deployment
docker build -t shelf-ai .
docker run -p 80:80 shelf-ai
```

#### Manual Production Build
```bash
# Build frontend for production
cd frontend
npm run build

# Serve built files with a web server (nginx, apache, etc.)
# Backend should be run with production ASGI server
cd ../backend
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔍 Application Access & Testing

### Local Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **API Redoc**: http://localhost:8000/redoc

### Health Checks
```bash
# Backend health check
curl http://localhost:8000/

# API health check
curl http://localhost:8000/api/

# Test chat endpoint
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need a 36 inch wide shelf", "session_id": "test-session"}'
```

## 🛠️ Development Workflow

### Code Structure Guidelines

#### Backend Development (`backend/server.py`)
```python
# Key functions and classes:
- ChatMessage(BaseModel)      # Pydantic model for chat requests
- ChatResponse(BaseModel)     # Pydantic model for chat responses
- LlmChat                     # Mock AI chat implementation
- UserMessage                 # Mock user message class
- extract_entities_from_response()  # Entity extraction logic
- check_sufficient_entities() # Validation for required parameters
```

#### Frontend Development (`frontend/src/App.js`)
```javascript
// Component hierarchy:
App
├── ChatInterface           # AI chat component
├── WireShelf3D            # Three.js 3D visualization
├── ParameterControls      # Configuration panel
└── BillOfMaterials       # Parts list and specifications

// State management:
- shelfParams              # Current shelf configuration
- sessionId               # Chat session identifier
- messages                # Chat message history
```

### Adding New Features

#### Backend: Adding New API Endpoints
```python
@app.post("/api/new-endpoint")
async def new_endpoint(request: RequestModel):
    # Implementation here
    return {"status": "success"}
```

#### Frontend: Adding New 3D Features
```javascript
// In WireShelf3D component
const newFeature = new THREE.Mesh(geometry, material);
newFeature.position.set(x, y, z);
shelfGroup.add(newFeature);
```

### Debugging & Troubleshooting

#### Common Issues

1. **Backend not starting**
   ```bash
   # Check Python version
   python --version

   # Verify dependencies
   pip list

   # Check for port conflicts
   netstat -tulpn | grep :8000
   ```

2. **Frontend build errors**
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **3D rendering issues**
   ```javascript
   // Check browser WebGL support
   // Open browser console and run:
   const canvas = document.createElement('canvas');
   const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
   console.log('WebGL supported:', !!gl);
   ```

4. **CORS errors**
   ```python
   # Verify CORS configuration in backend/server.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Configure appropriately for production
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 📊 Performance Optimization

### Frontend Optimization
- **3D Rendering**: Optimized geometry and materials
- **Bundle Size**: Code splitting and lazy loading
- **Memory Management**: Proper cleanup of Three.js objects
- **Responsive Design**: Efficient CSS with variables

### Backend Optimization
- **Async Operations**: FastAPI async/await patterns
- **Memory Usage**: In-memory session storage (consider Redis for production)
- **Response Time**: Efficient entity extraction algorithms

## 🔒 Security Considerations

### Development Environment
- Mock AI implementation (no external API keys required)
- CORS configured for development (localhost origins)
- No authentication required for basic functionality

### Production Deployment
- Configure CORS for specific domains
- Implement rate limiting
- Add authentication/authorization if required
- Use environment variables for sensitive configuration
- Enable HTTPS/TLS encryption

## 📝 API Documentation

### Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "message": "I need a 48 inch wide, 24 inch deep shelf",
  "session_id": "unique-session-id"
}

Response:
{
  "response": "AI response text",
  "extracted_entities": {
    "width": 48,
    "length": 24,
    "postHeight": null,
    "numberOfShelves": null
  },
  "has_sufficient_entities": false,
  "next_questions": ["How tall should it be?", "How many shelves do you need?"]
}
```

### Entity Extraction
The system extracts the following entities from natural language:
- **width**: Shelf width in inches
- **length**: Shelf depth/length in inches
- **postHeight**: Overall height in inches
- **numberOfShelves**: Number of shelf levels
- **color**: Finish color (Chrome, Black, White, Stainless Steel, Bronze)
- **shelfStyle**: Style (Industrial Grid, Metro Classic, Commercial Pro, Heavy Duty)
- **solidBottomShelf**: Boolean for solid bottom shelf
- **postType**: Stationary or Mobile

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Open http://localhost:3000
3. Interact with the AI chat to configure a shelf
4. Verify 3D model updates in real-time
5. Test parameter controls panel
6. Check responsive design on different screen sizes

### API Testing
```bash
# Test chat functionality
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "48 inch wide shelf with 4 levels", "session_id": "test"}'

# Test session management
curl http://localhost:8000/api/chat/history/test
curl -X DELETE http://localhost:8000/api/chat/test
```

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Documentation**: https://reactjs.org/docs/
- **Three.js Documentation**: https://threejs.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
