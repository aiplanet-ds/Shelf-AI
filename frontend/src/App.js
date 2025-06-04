import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Enhanced Wire Shelf 3D Component with better visual representation
const WireShelf3D = ({ width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf, postType }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with better lighting and materials
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafbfc);
    
    const camera = new THREE.PerspectiveCamera(75, 900 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(900, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Clear previous content
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.3, 100);
    pointLight.position.set(-20, 30, 20);
    scene.add(pointLight);

    // Enhanced material system based on color and style
    const getColorHex = (colorName) => {
      const colors = {
        'Chrome': 0xc0c0c0,
        'Black': 0x2d2d30,
        'White': 0xf8f9fa,
        'Stainless Steel': 0xe8e9ea,
        'Bronze': 0xcd7f32
      };
      return colors[colorName] || 0xc0c0c0;
    };

    const createMaterials = (colorName, style) => {
      const baseColor = getColorHex(colorName);
      
      // Different materials based on style
      const materialProps = {
        'Industrial Grid': { metalness: 0.8, roughness: 0.3, emissive: 0x000000 },
        'Metro Classic': { metalness: 0.6, roughness: 0.4, emissive: 0x111111 },
        'Commercial Pro': { metalness: 0.9, roughness: 0.2, emissive: 0x000000 },
        'Heavy Duty': { metalness: 0.7, roughness: 0.5, emissive: 0x000000 }
      };
      
      const props = materialProps[style] || materialProps['Industrial Grid'];
      
      return {
        wire: new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: props.metalness,
          roughness: props.roughness,
          emissive: props.emissive
        }),
        solid: new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: props.metalness * 0.8,
          roughness: props.roughness + 0.1
        }),
        post: new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: props.metalness,
          roughness: props.roughness - 0.1
        })
      };
    };

    const materials = createMaterials(color, shelfStyle);

    // Create wire shelf group
    const shelfGroup = new THREE.Group();

    // Enhanced Posts with better geometry
    const postRadius = 0.4;
    const postGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 16);
    const postPositions = [
      [-width/2, postHeight/2, -length/2],
      [width/2, postHeight/2, -length/2],
      [-width/2, postHeight/2, length/2],
      [width/2, postHeight/2, length/2]
    ];

    postPositions.forEach(pos => {
      const post = new THREE.Mesh(postGeometry, materials.post);
      post.position.set(pos[0], pos[1], pos[2]);
      post.castShadow = true;
      post.receiveShadow = true;
      shelfGroup.add(post);
    });

    // Enhanced Shelves with style-specific patterns
    const shelfSpacing = postHeight / (numberOfShelves + 1);
    
    for (let i = 0; i < numberOfShelves; i++) {
      const shelfY = (i + 1) * shelfSpacing;
      
      if (solidBottomShelf && i === 0) {
        // Enhanced solid bottom shelf
        const solidShelfGeometry = new THREE.BoxGeometry(width, 0.2, length);
        const solidShelf = new THREE.Mesh(solidShelfGeometry, materials.solid);
        solidShelf.position.set(0, shelfY, 0);
        solidShelf.castShadow = true;
        solidShelf.receiveShadow = true;
        
        // Add reinforcement edges
        const edgeGeometry = new THREE.BoxGeometry(width + 0.2, 0.3, 0.2);
        const frontEdge = new THREE.Mesh(edgeGeometry, materials.wire);
        frontEdge.position.set(0, shelfY, length/2 + 0.1);
        const backEdge = new THREE.Mesh(edgeGeometry, materials.wire);
        backEdge.position.set(0, shelfY, -length/2 - 0.1);
        
        shelfGroup.add(solidShelf, frontEdge, backEdge);
      } else {
        // Enhanced wire shelf with style-specific patterns
        const wireGroup = new THREE.Group();
        
        // Style-specific wire patterns
        let wireSpacing, wireThickness;
        switch (shelfStyle) {
          case 'Industrial Grid':
            wireSpacing = 1.5;
            wireThickness = 0.08;
            break;
          case 'Metro Classic':
            wireSpacing = 2.0;
            wireThickness = 0.06;
            break;
          case 'Commercial Pro':
            wireSpacing = 1.0;
            wireThickness = 0.1;
            break;
          case 'Heavy Duty':
            wireSpacing = 1.2;
            wireThickness = 0.12;
            break;
          default:
            wireSpacing = 1.5;
            wireThickness = 0.08;
        }
        
        // Horizontal wires (length direction)
        const numLengthWires = Math.floor(width / wireSpacing) + 1;
        for (let j = 0; j < numLengthWires; j++) {
          const wireGeometry = new THREE.CylinderGeometry(wireThickness, wireThickness, length, 8);
          const wire = new THREE.Mesh(wireGeometry, materials.wire);
          wire.rotation.x = Math.PI / 2;
          wire.position.set(-width/2 + (j * width/(numLengthWires-1)), shelfY, 0);
          wire.castShadow = true;
          wireGroup.add(wire);
        }
        
        // Vertical wires (width direction)
        const numWidthWires = Math.floor(length / wireSpacing) + 1;
        for (let j = 0; j < numWidthWires; j++) {
          const wireGeometry = new THREE.CylinderGeometry(wireThickness, wireThickness, width, 8);
          const wire = new THREE.Mesh(wireGeometry, materials.wire);
          wire.rotation.z = Math.PI / 2;
          wire.position.set(0, shelfY, -length/2 + (j * length/(numWidthWires-1)));
          wire.castShadow = true;
          wireGroup.add(wire);
        }
        
        // Add frame reinforcement for Heavy Duty style
        if (shelfStyle === 'Heavy Duty') {
          const frameGeometry = new THREE.BoxGeometry(width, 0.15, 0.15);
          const frontFrame = new THREE.Mesh(frameGeometry, materials.wire);
          frontFrame.position.set(0, shelfY, length/2);
          const backFrame = new THREE.Mesh(frameGeometry, materials.wire);
          backFrame.position.set(0, shelfY, -length/2);
          wireGroup.add(frontFrame, backFrame);
        }
        
        shelfGroup.add(wireGroup);
      }
    }

    // Enhanced frame supports
    const frameThickness = 0.15;
    const frameGeometry = new THREE.CylinderGeometry(frameThickness, frameThickness, width, 8);
    const supportLevels = numberOfShelves > 4 ? 3 : 2;
    
    for (let level = 1; level <= supportLevels; level++) {
      const frameY = (postHeight / (supportLevels + 1)) * level;
      const frames = [
        { pos: [0, frameY, -length/2], rot: [0, 0, Math.PI/2] },
        { pos: [0, frameY, length/2], rot: [0, 0, Math.PI/2] }
      ];

      frames.forEach(frame => {
        const frameMesh = new THREE.Mesh(frameGeometry, materials.wire);
        frameMesh.position.set(frame.pos[0], frame.pos[1], frame.pos[2]);
        frameMesh.rotation.set(frame.rot[0], frame.rot[1], frame.rot[2]);
        frameMesh.castShadow = true;
        shelfGroup.add(frameMesh);
      });
    }

    // Add casters for mobile units
    if (postType === 'Mobile') {
      const casterGeometry = new THREE.SphereGeometry(0.8, 16, 16);
      const casterMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.3, roughness: 0.7 });
      
      postPositions.forEach(pos => {
        const caster = new THREE.Mesh(casterGeometry, casterMaterial);
        caster.position.set(pos[0], 0.8, pos[2]);
        caster.castShadow = true;
        shelfGroup.add(caster);
        
        // Add caster plate
        const plateGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
        const plate = new THREE.Mesh(plateGeometry, materials.post);
        plate.position.set(pos[0], 1.2, pos[2]);
        shelfGroup.add(plate);
      });
    }

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(shelfGroup);

    // Enhanced camera positioning
    const distance = Math.max(width, length, postHeight) * 1.8;
    camera.position.set(distance * 0.8, distance * 0.6, distance * 0.8);
    camera.lookAt(0, postHeight/2, 0);

    // Animation loop with smooth rotation
    let rotationSpeed = 0.003;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      shelfGroup.rotation.y += rotationSpeed;
      
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
  }, [width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf, postType]);

  return <div ref={mountRef} className="border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden" />;
};

// Enhanced Chat Component with Real Gemini AI
const ChatInterface = ({ onParametersExtracted, extractedParams, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chat with AI greeting
  useEffect(() => {
    if (!isInitialized) {
      const initializeChat = async () => {
        try {
          const response = await axios.post(`${API}/chat`, {
            message: "Hello! I'm ready to help design wire shelving.",
            session_id: sessionId
          });
          
          setMessages([{ type: 'ai', content: response.data.response }]);
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing chat:', error);
          setMessages([{ 
            type: 'ai', 
            content: "Hello! I'm here to help you design the perfect wire shelving unit. Let's start by understanding your storage needs. What dimensions are you thinking about?" 
          }]);
          setIsInitialized(true);
        }
      };
      
      initializeChat();
    }
  }, [sessionId, isInitialized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: currentInput,
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

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 h-[500px] flex flex-col">
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Wire Shelf Designer</h3>
          <p className="text-sm text-gray-500">Professional design assistant</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white ml-4' 
                : 'bg-gray-100 text-gray-800 mr-4'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl mr-4">
              <div className="flex items-center space-x-2">
                <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"></div>
                <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full" style={{animationDelay: '0.1s'}}></div>
                <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your shelving needs..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Enhanced Parameter Controls Component
const ParameterControls = ({ params, onParamsChange }) => {
  const updateParam = (key, value) => {
    onParamsChange({ ...params, [key]: value });
  };

  const hasRequiredParams = params.width && params.length && params.postHeight && params.numberOfShelves;

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 space-y-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Configuration</h3>
        {hasRequiredParams && (
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
            Ready to Build
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Required Parameters */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">Required Dimensions</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (inches)</label>
              <input
                type="number"
                value={params.width || ''}
                onChange={(e) => updateParam('width', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="12" max="96"
                placeholder="e.g., 36"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (inches)</label>
              <input
                type="number"
                value={params.length || ''}
                onChange={(e) => updateParam('length', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="12" max="96"
                placeholder="e.g., 18"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
              <input
                type="number"
                value={params.postHeight || ''}
                onChange={(e) => updateParam('postHeight', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="24" max="84"
                placeholder="e.g., 72"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Shelves</label>
              <input
                type="number"
                value={params.numberOfShelves || ''}
                onChange={(e) => updateParam('numberOfShelves', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2" max="8"
                placeholder="e.g., 4"
              />
            </div>
          </div>
        </div>

        {/* Optional Parameters */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Style & Finish Options</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color & Finish</label>
              <select
                value={params.color || 'Chrome'}
                onChange={(e) => updateParam('color', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Industrial Grid">Industrial Grid</option>
                <option value="Metro Classic">Metro Classic</option>
                <option value="Commercial Pro">Commercial Pro</option>
                <option value="Heavy Duty">Heavy Duty</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-700">Solid Bottom Shelf</label>
                <p className="text-xs text-gray-500">More stable for heavy items</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.solidBottomShelf || false}
                  onChange={(e) => updateParam('solidBottomShelf', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
              <select
                value={params.postType || 'Stationary'}
                onChange={(e) => updateParam('postType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Stationary">Stationary</option>
                <option value="Mobile">Mobile (with casters)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Bill of Materials Component
const BillOfMaterials = ({ params }) => {
  const generateBOM = () => {
    if (!params.width || !params.length || !params.postHeight || !params.numberOfShelves) {
      return [];
    }

    const items = [];
    
    // Posts
    items.push({
      description: `Vertical Posts - ${params.shelfStyle || 'Standard'}`,
      modelNumber: `VP-${params.postHeight}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
      quantity: 4,
      length: `${params.postHeight}"`,
      width: `0.8"`,
      colorFinish: params.color || 'Chrome'
    });

    // Shelves
    for (let i = 0; i < params.numberOfShelves; i++) {
      if (params.solidBottomShelf && i === 0) {
        items.push({
          description: 'Solid Bottom Shelf Panel',
          modelNumber: `SBS-${params.width}x${params.length}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
          quantity: 1,
          length: `${params.length}"`,
          width: `${params.width}"`,
          colorFinish: params.color || 'Chrome'
        });
      } else {
        const wireSpacing = params.shelfStyle === 'Commercial Pro' ? '1" Grid' : 
                           params.shelfStyle === 'Metro Classic' ? '2" Grid' : 
                           params.shelfStyle === 'Heavy Duty' ? '1.2" Grid' : '1.5" Grid';
        
        items.push({
          description: `Wire Shelf - ${params.shelfStyle || 'Industrial Grid'} (${wireSpacing})`,
          modelNumber: `WS-${params.width}x${params.length}-${params.shelfStyle?.replace(/\s+/g, '') || 'IG'}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
          quantity: 1,
          length: `${params.length}"`,
          width: `${params.width}"`,
          colorFinish: params.color || 'Chrome'
        });
      }
    }

    // Frame supports
    const supportCount = params.numberOfShelves > 4 ? 6 : 4;
    items.push({
      description: 'Frame Support Rails',
      modelNumber: `FSR-${params.width}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
      quantity: supportCount,
      length: `${params.width}"`,
      width: `0.3"`,
      colorFinish: params.color || 'Chrome'
    });

    // Hardware
    const clipCount = params.numberOfShelves * 4;
    items.push({
      description: 'Shelf Clips & Mounting Hardware',
      modelNumber: `SCH-${clipCount}`,
      quantity: clipCount,
      length: '-',
      width: '-',
      colorFinish: params.color || 'Chrome'
    });

    // Casters if mobile
    if (params.postType === 'Mobile') {
      items.push({
        description: 'Heavy Duty Swivel Casters (4" wheels)',
        modelNumber: `HDC-4-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
        quantity: 4,
        length: '4"',
        width: '4"',
        colorFinish: params.color || 'Chrome'
      });
    }

    return items;
  };

  const bomItems = generateBOM();
  const estimatedWeight = bomItems.length > 0 ? 
    Math.round(params.width * params.length * params.numberOfShelves * 0.8 + params.postHeight * 2) : 0;

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Bill of Materials</h3>
        {bomItems.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Estimated Weight: <span className="font-semibold">{estimatedWeight} lbs</span></p>
            <p className="text-sm text-gray-600">Total Components: <span className="font-semibold">{bomItems.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
          </div>
        )}
      </div>
      
      {bomItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">Complete the configuration to see the bill of materials</p>
          <p className="text-gray-400 text-sm mt-2">Chat with our AI assistant to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-2 font-semibold">Description</th>
                <th className="text-left py-3 px-2 font-semibold">Model #</th>
                <th className="text-center py-3 px-2 font-semibold">Qty</th>
                <th className="text-center py-3 px-2 font-semibold">Length</th>
                <th className="text-center py-3 px-2 font-semibold">Width</th>
                <th className="text-left py-3 px-2 font-semibold">Color/Finish</th>
              </tr>
            </thead>
            <tbody>
              {bomItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{item.description}</td>
                  <td className="py-3 px-2 font-mono text-xs bg-gray-100 rounded">{item.modelNumber}</td>
                  <td className="py-3 px-2 text-center font-semibold">{item.quantity}</td>
                  <td className="py-3 px-2 text-center">{item.length}</td>
                  <td className="py-3 px-2 text-center">{item.width}</td>
                  <td className="py-3 px-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {item.colorFinish}
                    </span>
                  </td>
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
    width: 0,
    length: 0,
    postHeight: 0,
    numberOfShelves: 0,
    color: 'Chrome',
    shelfStyle: 'Industrial Grid',
    solidBottomShelf: false,
    postType: 'Stationary'
  });

  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  const [showConfiguration, setShowConfiguration] = useState(true);

  const hasMinimumParams = shelfParams.width && shelfParams.length && shelfParams.postHeight && shelfParams.numberOfShelves;

  const updateShelfParams = (newParams) => {
    setShelfParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wire Shelves 3D Configurator</h1>
              <p className="text-gray-600 mt-2">Design your perfect shelving solution with our AI assistant</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                AI Powered
              </div>
              {hasMinimumParams && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  3D Ready
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Chat Interface */}
          <div className="xl:col-span-4">
            <ChatInterface 
              onParametersExtracted={updateShelfParams}
              extractedParams={shelfParams}
              sessionId={sessionId}
            />
          </div>

          {/* 3D Viewer */}
          <div className="xl:col-span-5">
            {hasMinimumParams ? (
              <div className="bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">3D Preview</h3>
                  <div className="flex space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{shelfParams.shelfStyle}</span>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{shelfParams.color}</span>
                  </div>
                </div>
                <WireShelf3D {...shelfParams} />
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Interactive 3D model • Auto-rotating • Real-time updates</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-6 h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-8xl mb-6">🏗️</div>
                  <h3 className="text-xl font-semibold mb-2">3D Model Preview</h3>
                  <p className="text-lg mb-4">3D model will appear once you provide the basic dimensions</p>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Required: Width, Length, Height, Number of Shelves</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="xl:col-span-3">
            <ParameterControls 
              params={shelfParams}
              onParamsChange={updateShelfParams}
            />
          </div>

          {/* Bill of Materials */}
          <div className="xl:col-span-12">
            <BillOfMaterials params={shelfParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;