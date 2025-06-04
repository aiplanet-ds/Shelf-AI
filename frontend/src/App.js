import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Wire Shelf 3D Component
const WireShelf3D = ({ width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Clear previous content
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Material for wire shelf
    const getColorHex = (colorName) => {
      const colors = {
        'Chrome': 0xc0c0c0,
        'Black': 0x2d3748,
        'White': 0xf7fafc,
        'Stainless Steel': 0xe2e8f0,
        'Bronze': 0xcd7f32
      };
      return colors[colorName] || 0xc0c0c0;
    };

    const wireframeMaterial = new THREE.MeshPhongMaterial({
      color: getColorHex(color),
      shininess: 100
    });

    const solidMaterial = new THREE.MeshPhongMaterial({
      color: getColorHex(color),
      shininess: 50
    });

    // Create wire shelf group
    const shelfGroup = new THREE.Group();

    // Posts (4 vertical posts at corners)
    const postGeometry = new THREE.CylinderGeometry(0.25, 0.25, postHeight);
    const postPositions = [
      [-width/2, postHeight/2, -length/2],
      [width/2, postHeight/2, -length/2],
      [-width/2, postHeight/2, length/2],
      [width/2, postHeight/2, length/2]
    ];

    postPositions.forEach(pos => {
      const post = new THREE.Mesh(postGeometry, wireframeMaterial);
      post.position.set(pos[0], pos[1], pos[2]);
      post.castShadow = true;
      shelfGroup.add(post);
    });

    // Shelves
    const shelfSpacing = postHeight / (numberOfShelves + 1);
    
    for (let i = 0; i < numberOfShelves; i++) {
      const shelfY = (i + 1) * shelfSpacing;
      
      if (solidBottomShelf && i === 0) {
        // Solid bottom shelf
        const solidShelfGeometry = new THREE.BoxGeometry(width, 0.1, length);
        const solidShelf = new THREE.Mesh(solidShelfGeometry, solidMaterial);
        solidShelf.position.set(0, shelfY, 0);
        solidShelf.castShadow = true;
        solidShelf.receiveShadow = true;
        shelfGroup.add(solidShelf);
      } else {
        // Wire shelf - create wire grid pattern
        const wireGroup = new THREE.Group();
        
        // Horizontal wires (length direction)
        const numLengthWires = Math.floor(width / 2) + 1;
        for (let j = 0; j < numLengthWires; j++) {
          const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, length);
          const wire = new THREE.Mesh(wireGeometry, wireframeMaterial);
          wire.rotation.x = Math.PI / 2;
          wire.position.set(-width/2 + (j * width/(numLengthWires-1)), shelfY, 0);
          wireGroup.add(wire);
        }
        
        // Vertical wires (width direction)
        const numWidthWires = Math.floor(length / 2) + 1;
        for (let j = 0; j < numWidthWires; j++) {
          const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, width);
          const wire = new THREE.Mesh(wireGeometry, wireframeMaterial);
          wire.rotation.z = Math.PI / 2;
          wire.position.set(0, shelfY, -length/2 + (j * length/(numWidthWires-1)));
          wireGroup.add(wire);
        }
        
        shelfGroup.add(wireGroup);
      }
    }

    // Frame supports
    const frameGeometry = new THREE.CylinderGeometry(0.1, 0.1, width);
    const frames = [
      { pos: [0, postHeight * 0.25, -length/2], rot: [0, 0, Math.PI/2] },
      { pos: [0, postHeight * 0.25, length/2], rot: [0, 0, Math.PI/2] },
      { pos: [0, postHeight * 0.75, -length/2], rot: [0, 0, Math.PI/2] },
      { pos: [0, postHeight * 0.75, length/2], rot: [0, 0, Math.PI/2] }
    ];

    frames.forEach(frame => {
      const frameMesh = new THREE.Mesh(frameGeometry, wireframeMaterial);
      frameMesh.position.set(frame.pos[0], frame.pos[1], frame.pos[2]);
      frameMesh.rotation.set(frame.rot[0], frame.rot[1], frame.rot[2]);
      shelfGroup.add(frameMesh);
    });

    scene.add(shelfGroup);

    // Position camera
    camera.position.set(width * 1.5, postHeight * 1.2, length * 1.5);
    camera.lookAt(0, postHeight/2, 0);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Slow rotation
      shelfGroup.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };

    animate();

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Cleanup function
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf]);

  return <div ref={mountRef} className="border-2 border-gray-200 rounded-lg shadow-lg" />;
};

// Chat Component
const ChatInterface = ({ onParametersExtracted, extractedParams }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', content: "Hello! I'm here to help you design the perfect wire shelving unit. Let's start with the basics - what are your storage needs?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Here you would integrate with Gemini AI
      // For now, I'll create a simple entity extraction logic
      const extractedEntities = extractEntitiesFromText(input, extractedParams);
      
      // Simulate AI response
      const aiResponse = generateAIResponse(extractedEntities, extractedParams);
      
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse.message }]);
      
      if (aiResponse.params) {
        onParametersExtracted(aiResponse.params);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: "I apologize, but I'm having trouble processing your request. Could you please rephrase?" }]);
    }

    setIsLoading(false);
  };

  const extractEntitiesFromText = (text, currentParams) => {
    const lowerText = text.toLowerCase();
    const extracted = { ...currentParams };

    // Extract dimensions
    const widthMatch = lowerText.match(/(\d+)\s*(?:inch|inches|in|"|'')?\s*wide|width.*?(\d+)/i);
    if (widthMatch) extracted.width = parseInt(widthMatch[1] || widthMatch[2]);

    const lengthMatch = lowerText.match(/(\d+)\s*(?:inch|inches|in|"|'')?\s*(?:long|length|deep|depth)/i);
    if (lengthMatch) extracted.length = parseInt(lengthMatch[1]);

    const heightMatch = lowerText.match(/(\d+)\s*(?:inch|inches|in|"|'')?\s*(?:tall|high|height)/i);
    if (heightMatch) extracted.postHeight = parseInt(heightMatch[1]);

    const shelvesMatch = lowerText.match(/(\d+)\s*(?:shelf|shelves|level|levels|tier|tiers)/i);
    if (shelvesMatch) extracted.numberOfShelves = parseInt(shelvesMatch[1]);

    // Extract colors
    const colors = ['chrome', 'black', 'white', 'stainless steel', 'bronze'];
    colors.forEach(color => {
      if (lowerText.includes(color)) extracted.color = color.charAt(0).toUpperCase() + color.slice(1);
    });

    return extracted;
  };

  const generateAIResponse = (extractedEntities, currentParams) => {
    const merged = { ...currentParams, ...extractedEntities };
    const missing = [];

    if (!merged.width) missing.push('width');
    if (!merged.length) missing.push('length');
    if (!merged.postHeight) missing.push('height');
    if (!merged.numberOfShelves) missing.push('number of shelves');

    if (missing.length === 0) {
      return {
        message: "Perfect! I have all the dimensions I need. Let me create your wire shelving unit. You can adjust any parameters using the controls on the right, or tell me about any changes you'd like to make.",
        params: merged
      };
    } else if (missing.length < 4) {
      return {
        message: `Great! I have ${Object.keys(extractedEntities).length > 0 ? 'some of' : ''} the information. I still need to know: ${missing.join(', ')}. Could you provide ${missing.length > 1 ? 'these dimensions' : 'this dimension'}?`,
        params: merged
      };
    } else {
      return {
        message: "I'd love to help you design your wire shelving! To get started, I need to know the basic dimensions: How wide, how long, how tall should it be, and how many shelves do you need?",
        params: merged
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your shelving needs..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Parameter Controls Component
const ParameterControls = ({ params, onParamsChange }) => {
  const updateParam = (key, value) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Configure Your Shelving</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width (inches)</label>
          <input
            type="number"
            value={params.width || ''}
            onChange={(e) => updateParam('width', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="12" max="96"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Length (inches)</label>
          <input
            type="number"
            value={params.length || ''}
            onChange={(e) => updateParam('length', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="12" max="96"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
          <input
            type="number"
            value={params.postHeight || ''}
            onChange={(e) => updateParam('postHeight', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="24" max="84"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Shelves</label>
          <input
            type="number"
            value={params.numberOfShelves || ''}
            onChange={(e) => updateParam('numberOfShelves', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="2" max="8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color & Finish</label>
          <select
            value={params.color || 'Chrome'}
            onChange={(e) => updateParam('color', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Chrome">Chrome</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Stainless Steel">Stainless Steel</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Style</label>
          <select
            value={params.shelfStyle || 'Industrial Grid'}
            onChange={(e) => updateParam('shelfStyle', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Industrial Grid">Industrial Grid</option>
            <option value="Metro Classic">Metro Classic</option>
            <option value="Commercial Pro">Commercial Pro</option>
            <option value="Heavy Duty">Heavy Duty</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="solidBottom"
            checked={params.solidBottomShelf || false}
            onChange={(e) => updateParam('solidBottomShelf', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="solidBottom" className="text-sm font-medium text-gray-700">
            Solid Bottom Shelf
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
          <select
            value={params.postType || 'Stationary'}
            onChange={(e) => updateParam('postType', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Stationary">Stationary</option>
            <option value="Mobile">Mobile (with casters)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Bill of Materials Component
const BillOfMaterials = ({ params }) => {
  const generateBOM = () => {
    if (!params.width || !params.length || !params.postHeight || !params.numberOfShelves) {
      return [];
    }

    const items = [];
    
    // Posts
    items.push({
      description: 'Vertical Posts',
      modelNumber: `VP-${params.postHeight}-${params.color?.replace(' ', '')}`,
      quantity: 4,
      length: params.postHeight,
      width: 0.5,
      colorFinish: params.color || 'Chrome'
    });

    // Shelves
    for (let i = 0; i < params.numberOfShelves; i++) {
      if (params.solidBottomShelf && i === 0) {
        items.push({
          description: 'Solid Bottom Shelf',
          modelNumber: `SBS-${params.width}x${params.length}-${params.color?.replace(' ', '')}`,
          quantity: 1,
          length: params.length,
          width: params.width,
          colorFinish: params.color || 'Chrome'
        });
      } else {
        items.push({
          description: `Wire Shelf - ${params.shelfStyle || 'Industrial Grid'}`,
          modelNumber: `WS-${params.width}x${params.length}-${params.shelfStyle?.replace(' ', '') || 'IG'}-${params.color?.replace(' ', '')}`,
          quantity: 1,
          length: params.length,
          width: params.width,
          colorFinish: params.color || 'Chrome'
        });
      }
    }

    // Frame supports
    items.push({
      description: 'Frame Support Rails',
      modelNumber: `FSR-${params.width}-${params.color?.replace(' ', '')}`,
      quantity: 4,
      length: params.width,
      width: 0.25,
      colorFinish: params.color || 'Chrome'
    });

    // Hardware
    items.push({
      description: 'Shelf Clips & Hardware',
      modelNumber: `SCH-${params.numberOfShelves * 4}`,
      quantity: params.numberOfShelves * 4,
      length: 0,
      width: 0,
      colorFinish: params.color || 'Chrome'
    });

    // Casters if mobile
    if (params.postType === 'Mobile') {
      items.push({
        description: 'Heavy Duty Casters',
        modelNumber: `HDC-4-${params.color?.replace(' ', '')}`,
        quantity: 4,
        length: 0,
        width: 0,
        colorFinish: params.color || 'Chrome'
      });
    }

    return items;
  };

  const bomItems = generateBOM();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill of Materials</h3>
      
      {bomItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Complete the configuration to see the bill of materials
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Model #</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-center py-2">Length</th>
                <th className="text-center py-2">Width</th>
                <th className="text-left py-2">Color/Finish</th>
              </tr>
            </thead>
            <tbody>
              {bomItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 font-mono text-xs">{item.modelNumber}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-center">{item.length || '-'}</td>
                  <td className="py-2 text-center">{item.width || '-'}</td>
                  <td className="py-2">{item.colorFinish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [shelfParams, setShelfParams] = useState({
    width: 36,
    length: 18,
    postHeight: 48,
    numberOfShelves: 4,
    color: 'Chrome',
    shelfStyle: 'Industrial Grid',
    solidBottomShelf: false,
    postType: 'Stationary'
  });

  const [showConfiguration, setShowConfiguration] = useState(false);

  const hasMinimumParams = shelfParams.width && shelfParams.length && shelfParams.postHeight && shelfParams.numberOfShelves;

  useEffect(() => {
    if (hasMinimumParams) {
      setShowConfiguration(true);
    }
  }, [hasMinimumParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Wire Shelves 3D Configurator</h1>
          <p className="text-gray-600">Design your perfect shelving solution with our AI assistant</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Chat Interface */}
          <div className="col-span-12 lg:col-span-4">
            <ChatInterface 
              onParametersExtracted={setShelfParams}
              extractedParams={shelfParams}
            />
          </div>

          {/* 3D Viewer */}
          <div className="col-span-12 lg:col-span-5">
            {hasMinimumParams ? (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">3D Preview</h3>
                <WireShelf3D {...shelfParams} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-4 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">📐</div>
                  <p>3D model will appear once you provide the basic dimensions</p>
                  <p className="text-sm mt-2">Share your requirements in the chat to get started!</p>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="col-span-12 lg:col-span-3">
            {showConfiguration ? (
              <ParameterControls 
                params={shelfParams}
                onParamsChange={setShelfParams}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-4 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">⚙️</div>
                  <p>Configuration panel will appear once basic dimensions are set</p>
                </div>
              </div>
            )}
          </div>

          {/* Bill of Materials */}
          <div className="col-span-12">
            <BillOfMaterials params={shelfParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;