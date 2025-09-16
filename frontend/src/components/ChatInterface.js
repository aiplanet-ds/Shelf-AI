import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Premium Chat Component with sophisticated design
const ChatInterface = ({ onParametersExtracted, extractedParams, sessionId, problemStatement, autoTrigger = false }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);

  // Reset component state when sessionId changes (new configuration)
  useEffect(() => {
    if (currentSessionId !== sessionId) {
      setMessages([]);
      setInput('');
      setIsLoading(false);
      setIsInitialized(false);
      setHasAutoTriggered(false);
      setCurrentSessionId(sessionId);
    }
  }, [sessionId, currentSessionId]);

  // Initialize chat with AI greeting
  useEffect(() => {
    if (!isInitialized) {
      const initializeChat = async () => {
        try {
          const response = await axios.post(`${API}/chat`, {
            message: "Hello! I'm ready to help design wire shelving.",
            session_id: sessionId
          });

          setMessages([
            { type: 'ai', content: response.data.response },
            { type: 'ai', content: 'To configure the 3D model quickly, please provide: Width (inches), Length/Depth (inches), Post height (inches), Number of shelves.' }
          ]);
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing chat:', error);
          setMessages([
            { type: 'ai', content: "Let's set up your wire shelving quickly." },
            { type: 'ai', content: 'Please provide: Width (inches), Length/Depth (inches), Post height (inches), Number of shelves.' }
          ]);
          setIsInitialized(true);
        }
      };

      initializeChat();
    }
  }, [sessionId, isInitialized]);

  // Auto-trigger problem statement processing
  useEffect(() => {
    if (autoTrigger && problemStatement && isInitialized && !hasAutoTriggered) {
      setHasAutoTriggered(true);

      // Add a delay to make it feel natural
      setTimeout(() => {
        // Add system message first
        setMessages(prev => [...prev, {
          type: 'system',
          content: '🤖 Automatically processing your requirements from previous steps...'
        }]);

        setTimeout(() => {
          const autoMessage = `Based on my previous analysis, here are my requirements: ${problemStatement}. Please extract these exact fields: width (inches), length/depth (inches), post height (inches), number of shelves, and configure the 3D model accordingly.`;

          // Add user message to chat
          setMessages(prev => [...prev, { type: 'user', content: autoMessage }]);

          // Process with AI
          processMessage(autoMessage);
        }, 1000);
      }, 1500);
    }
  }, [autoTrigger, problemStatement, isInitialized, hasAutoTriggered]);

  const processMessage = async (message) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: message,
        session_id: sessionId
      });

      const aiMessage = { type: 'ai', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);

      // Update extracted parameters
      if (response.data.extracted_entities) {
        onParametersExtracted(response.data.extracted_entities);
      }

    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request. Could you please try again?"
      }]);
    }

    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    await processMessage(currentInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="premium-card h-[820px] flex flex-col">
      <div className="premium-header p-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">AI Design Assistant</h3>
            <p className="text-gray-300 font-medium text-sm mt-0">Natural language shelf configuration</p>
          </div>
          <div className="premium-status-badge">
            <div className="status-dot animate-pulse"></div>
            <span className="text-sm font-semibold">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-3 premium-scrollbar">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${
            message.type === 'user' ? 'justify-end' :
            message.type === 'system' ? 'justify-center' : 'justify-start'
          }`}>
            <div className={`max-w-[85%] font-medium ${
              message.type === 'user'
                ? 'premium-user-message text-white ml-4'
                : message.type === 'system'
                ? 'premium-system-message text-green-400 text-center'
                : 'premium-ai-message text-gray-200 mr-4'
            }`}>
              <p className="leading-relaxed text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="premium-ai-message text-gray-200 mr-4">
              <div className="flex items-center space-x-2">
                <div className="premium-typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 pt-2 border-t border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter: Width (in), Length/Depth (in), Post Height (in), Number of Shelves"
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="premium-send-button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {extractedParams && Object.keys(extractedParams).length > 0 && (
          <div className="mt-3 p-2 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="text-xs text-green-400 font-semibold mb-1">Extracted Parameters:</div>
            <div className="text-xs text-gray-300 space-y-1">
              {extractedParams.width && <div>Width: {extractedParams.width}"</div>}
              {extractedParams.length && <div>Length: {extractedParams.length}"</div>}
              {extractedParams.postHeight && <div>Height: {extractedParams.postHeight}"</div>}
              {extractedParams.numberOfShelves && <div>Shelves: {extractedParams.numberOfShelves}</div>}
              {extractedParams.color && <div>Finish: {extractedParams.color}</div>}
              {extractedParams.shelfStyle && <div>Style: {extractedParams.shelfStyle}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
