import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Enhanced Wire Shelf 3D Component with premium materials
const WireShelf3D = ({ width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf, postType }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Premium scene setup with sophisticated lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafb);
    
    const camera = new THREE.PerspectiveCamera(75, 900 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(900, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Clear previous content
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Premium lighting setup for photorealistic appearance
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(50, 60, 40);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.4);
    rimLight.position.set(-30, 20, -30);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.2, 100);
    fillLight.position.set(10, 20, 30);
    scene.add(fillLight);

    // Premium material system with realistic properties
    const getColorHex = (colorName) => {
      const colors = {
        'Chrome': 0xe8e9ea,
        'Black': 0x1a1a1a,
        'White': 0xfafbfc,
        'Stainless Steel': 0xd1d5db,
        'Bronze': 0xb08d57
      };
      return colors[colorName] || 0xe8e9ea;
    };

    const createPremiumMaterials = (colorName, style) => {
      const baseColor = getColorHex(colorName);
      
      // Premium material properties for each style
      const materialProps = {
        'Industrial Grid': { metalness: 0.9, roughness: 0.2, clearcoat: 0.1 },
        'Metro Classic': { metalness: 0.7, roughness: 0.3, clearcoat: 0.05 },
        'Commercial Pro': { metalness: 0.95, roughness: 0.15, clearcoat: 0.2 },
        'Heavy Duty': { metalness: 0.8, roughness: 0.25, clearcoat: 0.0 }
      };
      
      const props = materialProps[style] || materialProps['Industrial Grid'];
      
      return {
        wire: new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: props.metalness,
          roughness: props.roughness,
          clearcoat: props.clearcoat,
          clearcoatRoughness: 0.05,
          reflectivity: 0.9,
          envMapIntensity: 1.5
        }),
        solid: new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: props.metalness * 0.9,
          roughness: props.roughness + 0.1,
          clearcoat: props.clearcoat * 0.5,
          reflectivity: 0.8
        }),
        post: new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: props.metalness,
          roughness: props.roughness - 0.05,
          clearcoat: props.clearcoat,
          reflectivity: 0.95
        })
      };
    };

    const materials = createPremiumMaterials(color, shelfStyle);

    // Create wire shelf group
    const shelfGroup = new THREE.Group();

    // Premium Posts with enhanced geometry
    const postRadius = 0.4;
    const postGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 24);
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

    // Premium Shelves with sophisticated patterns
    const shelfSpacing = postHeight / (numberOfShelves + 1);
    
    for (let i = 0; i < numberOfShelves; i++) {
      const shelfY = (i + 1) * shelfSpacing;
      
      if (solidBottomShelf && i === 0) {
        // Premium solid bottom shelf
        const solidShelfGeometry = new THREE.BoxGeometry(width, 0.25, length);
        const solidShelf = new THREE.Mesh(solidShelfGeometry, materials.solid);
        solidShelf.position.set(0, shelfY, 0);
        solidShelf.castShadow = true;
        solidShelf.receiveShadow = true;
        
        // Premium reinforcement edges
        const edgeGeometry = new THREE.BoxGeometry(width + 0.3, 0.35, 0.25);
        const frontEdge = new THREE.Mesh(edgeGeometry, materials.wire);
        frontEdge.position.set(0, shelfY, length/2 + 0.125);
        const backEdge = new THREE.Mesh(edgeGeometry, materials.wire);
        backEdge.position.set(0, shelfY, -length/2 - 0.125);
        
        shelfGroup.add(solidShelf, frontEdge, backEdge);
      } else {
        // Premium wire shelf with style-specific patterns
        const wireGroup = new THREE.Group();
        
        // Style-specific premium wire patterns
        let wireSpacing, wireThickness, segments;
        switch (shelfStyle) {
          case 'Industrial Grid':
            wireSpacing = 1.5;
            wireThickness = 0.08;
            segments = 12;
            break;
          case 'Metro Classic':
            wireSpacing = 2.0;
            wireThickness = 0.06;
            segments = 16;
            break;
          case 'Commercial Pro':
            wireSpacing = 1.0;
            wireThickness = 0.1;
            segments = 20;
            break;
          case 'Heavy Duty':
            wireSpacing = 1.2;
            wireThickness = 0.12;
            segments = 16;
            break;
          default:
            wireSpacing = 1.5;
            wireThickness = 0.08;
            segments = 12;
        }
        
        // Horizontal wires with premium geometry
        const numLengthWires = Math.floor(width / wireSpacing) + 1;
        for (let j = 0; j < numLengthWires; j++) {
          const wireGeometry = new THREE.CylinderGeometry(wireThickness, wireThickness, length, segments);
          const wire = new THREE.Mesh(wireGeometry, materials.wire);
          wire.rotation.x = Math.PI / 2;
          wire.position.set(-width/2 + (j * width/(numLengthWires-1)), shelfY, 0);
          wire.castShadow = true;
          wire.receiveShadow = true;
          wireGroup.add(wire);
        }
        
        // Vertical wires with premium geometry
        const numWidthWires = Math.floor(length / wireSpacing) + 1;
        for (let j = 0; j < numWidthWires; j++) {
          const wireGeometry = new THREE.CylinderGeometry(wireThickness, wireThickness, width, segments);
          const wire = new THREE.Mesh(wireGeometry, materials.wire);
          wire.rotation.z = Math.PI / 2;
          wire.position.set(0, shelfY, -length/2 + (j * length/(numWidthWires-1)));
          wire.castShadow = true;
          wire.receiveShadow = true;
          wireGroup.add(wire);
        }
        
        // Premium frame reinforcement for Heavy Duty style
        if (shelfStyle === 'Heavy Duty') {
          const frameGeometry = new THREE.BoxGeometry(width, 0.2, 0.2);
          const frontFrame = new THREE.Mesh(frameGeometry, materials.wire);
          frontFrame.position.set(0, shelfY, length/2);
          frontFrame.castShadow = true;
          const backFrame = new THREE.Mesh(frameGeometry, materials.wire);
          backFrame.position.set(0, shelfY, -length/2);
          backFrame.castShadow = true;
          wireGroup.add(frontFrame, backFrame);
        }
        
        shelfGroup.add(wireGroup);
      }
    }

    // Premium frame supports
    const frameThickness = 0.18;
    const frameGeometry = new THREE.CylinderGeometry(frameThickness, frameThickness, width, 16);
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
        frameMesh.receiveShadow = true;
        shelfGroup.add(frameMesh);
      });
    }

    // Premium casters for mobile units
    if (postType === 'Mobile') {
      const casterGeometry = new THREE.SphereGeometry(0.9, 24, 24);
      const casterMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x2a2a2a, 
        metalness: 0.2, 
        roughness: 0.8,
        clearcoat: 0.1
      });
      
      postPositions.forEach(pos => {
        const caster = new THREE.Mesh(casterGeometry, casterMaterial);
        caster.position.set(pos[0], 0.9, pos[2]);
        caster.castShadow = true;
        shelfGroup.add(caster);
        
        // Premium caster plate
        const plateGeometry = new THREE.CylinderGeometry(1.3, 1.3, 0.35, 24);
        const plate = new THREE.Mesh(plateGeometry, materials.post);
        plate.position.set(pos[0], 1.3, pos[2]);
        plate.castShadow = true;
        shelfGroup.add(plate);
      });
    }

    // Premium ground plane with subtle gradient
    const groundGeometry = new THREE.PlaneGeometry(120, 120);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xf1f3f4, 
      transparent: true, 
      opacity: 0.4 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(shelfGroup);

    // Premium camera positioning
    const distance = Math.max(width, length, postHeight) * 1.6;
    camera.position.set(distance * 0.7, distance * 0.5, distance * 0.9);
    camera.lookAt(0, postHeight/2, 0);

    // Smooth animation with premium easing
    let rotationSpeed = 0.002;
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

  return (
    <div className="premium-3d-container">
      <div ref={mountRef} className="rounded-2xl overflow-hidden shadow-premium" />
    </div>
  );
};

// Premium Chat Component with sophisticated design
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
    <div className="premium-card h-[650px] flex flex-col">
      <div className="premium-header p-6 pb-4">
        <div className="flex items-center">
          <div className="premium-avatar mr-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8c1.86 0 3.58-.63 4.95-1.69L17.71 18.1c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.79-1.79C18.37 13.58 19 11.86 19 10c0-4.42-3.58-8-8-8zm0 2c3.32 0 6 2.68 6 6s-2.68 6-6 6-6-2.68-6-6 2.68-6 6-6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Wire Shelf Designer</h3>
            <p className="text-slate-500 font-medium">Professional AI Assistant</p>
          </div>
          <div className="ml-auto">
            <div className="premium-status-badge">
              <div className="status-dot animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4 premium-scrollbar">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-2xl font-medium ${
              message.type === 'user' 
                ? 'premium-user-message text-white ml-6' 
                : 'premium-ai-message text-slate-700 mr-6'
            }`}>
              <p className="leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="premium-ai-message text-slate-700 px-5 py-4 rounded-2xl mr-6">
              <div className="flex items-center space-x-2">
                <div className="premium-loading-dot"></div>
                <div className="premium-loading-dot" style={{animationDelay: '0.15s'}}></div>
                <div className="premium-loading-dot" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="premium-input-container p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="premium-input flex-1"
            placeholder="Describe your shelving requirements..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="premium-send-button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Premium Parameter Controls Component
const ParameterControls = ({ params, onParamsChange }) => {
  const updateParam = (key, value) => {
    onParamsChange({ ...params, [key]: value });
  };

  const hasRequiredParams = params.width && params.length && params.postHeight && params.numberOfShelves;

  return (
    <div className="premium-card space-y-6">
      <div className="premium-header p-6 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Configuration Panel</h3>
          {hasRequiredParams && (
            <div className="premium-ready-badge">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Ready to Build
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 pb-6 space-y-6">
        {/* Required Parameters */}
        <div className="premium-section-required">
          <h4 className="premium-section-title mb-4">Essential Dimensions</h4>
          <div className="space-y-4">
            <div className="premium-input-group">
              <label className="premium-label">Width (inches)</label>
              <input
                type="number"
                value={params.width || ''}
                onChange={(e) => updateParam('width', parseInt(e.target.value) || 0)}
                className="premium-number-input"
                min="12" max="96"
                placeholder="36"
              />
            </div>
            
            <div className="premium-input-group">
              <label className="premium-label">Length (inches)</label>
              <input
                type="number"
                value={params.length || ''}
                onChange={(e) => updateParam('length', parseInt(e.target.value) || 0)}
                className="premium-number-input"
                min="12" max="96"
                placeholder="18"
              />
            </div>
            
            <div className="premium-input-group">
              <label className="premium-label">Height (inches)</label>
              <input
                type="number"
                value={params.postHeight || ''}
                onChange={(e) => updateParam('postHeight', parseInt(e.target.value) || 0)}
                className="premium-number-input"
                min="24" max="84"
                placeholder="72"
              />
            </div>
            
            <div className="premium-input-group">
              <label className="premium-label">Number of Shelves</label>
              <input
                type="number"
                value={params.numberOfShelves || ''}
                onChange={(e) => updateParam('numberOfShelves', parseInt(e.target.value) || 0)}
                className="premium-number-input"
                min="2" max="8"
                placeholder="4"
              />
            </div>
          </div>
        </div>

        {/* Optional Parameters */}
        <div className="premium-section-optional">
          <h4 className="premium-section-title mb-4">Style & Finish Options</h4>
          <div className="space-y-4">
            <div className="premium-input-group">
              <label className="premium-label">Color & Finish</label>
              <select
                value={params.color || 'Chrome'}
                onChange={(e) => updateParam('color', e.target.value)}
                className="premium-select"
              >
                <option value="Chrome">Chrome</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>
            
            <div className="premium-input-group">
              <label className="premium-label">Shelf Style</label>
              <select
                value={params.shelfStyle || 'Industrial Grid'}
                onChange={(e) => updateParam('shelfStyle', e.target.value)}
                className="premium-select"
              >
                <option value="Industrial Grid">Industrial Grid</option>
                <option value="Metro Classic">Metro Classic</option>
                <option value="Commercial Pro">Commercial Pro</option>
                <option value="Heavy Duty">Heavy Duty</option>
              </select>
            </div>
            
            <div className="premium-toggle-container">
              <div className="premium-toggle-info">
                <label className="premium-label">Solid Bottom Shelf</label>
                <p className="premium-sublabel">Enhanced stability for heavy items</p>
              </div>
              <label className="premium-toggle">
                <input
                  type="checkbox"
                  checked={params.solidBottomShelf || false}
                  onChange={(e) => updateParam('solidBottomShelf', e.target.checked)}
                  className="sr-only"
                />
                <div className="premium-toggle-slider"></div>
              </label>
            </div>
            
            <div className="premium-input-group">
              <label className="premium-label">Mobility Type</label>
              <select
                value={params.postType || 'Stationary'}
                onChange={(e) => updateParam('postType', e.target.value)}
                className="premium-select"
              >
                <option value="Stationary">Stationary</option>
                <option value="Mobile">Mobile (with premium casters)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Premium Bill of Materials Component
const BillOfMaterials = ({ params }) => {
  const generateBOM = () => {
    if (!params.width || !params.length || !params.postHeight || !params.numberOfShelves) {
      return [];
    }

    const items = [];
    
    // Posts
    items.push({
      description: `Vertical Support Posts - ${params.shelfStyle || 'Standard'} Series`,
      modelNumber: `VP-${params.postHeight}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
      quantity: 4,
      length: `${params.postHeight}"`,
      width: `0.8"`,
      colorFinish: params.color || 'Chrome',
      category: 'Structure'
    });

    // Shelves
    for (let i = 0; i < params.numberOfShelves; i++) {
      if (params.solidBottomShelf && i === 0) {
        items.push({
          description: 'Premium Solid Bottom Shelf Panel',
          modelNumber: `SBS-${params.width}x${params.length}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
          quantity: 1,
          length: `${params.length}"`,
          width: `${params.width}"`,
          colorFinish: params.color || 'Chrome',
          category: 'Shelving'
        });
      } else {
        const wireSpacing = params.shelfStyle === 'Commercial Pro' ? '1" Grid' : 
                           params.shelfStyle === 'Metro Classic' ? '2" Grid' : 
                           params.shelfStyle === 'Heavy Duty' ? '1.2" Grid' : '1.5" Grid';
        
        items.push({
          description: `Premium Wire Shelf - ${params.shelfStyle || 'Industrial Grid'} (${wireSpacing})`,
          modelNumber: `WS-${params.width}x${params.length}-${params.shelfStyle?.replace(/\s+/g, '') || 'IG'}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
          quantity: 1,
          length: `${params.length}"`,
          width: `${params.width}"`,
          colorFinish: params.color || 'Chrome',
          category: 'Shelving'
        });
      }
    }

    // Frame supports
    const supportCount = params.numberOfShelves > 4 ? 6 : 4;
    items.push({
      description: 'Reinforcement Frame Support Rails',
      modelNumber: `FSR-${params.width}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
      quantity: supportCount,
      length: `${params.width}"`,
      width: `0.35"`,
      colorFinish: params.color || 'Chrome',
      category: 'Structure'
    });

    // Hardware
    const clipCount = params.numberOfShelves * 4;
    items.push({
      description: 'Premium Shelf Clips & Mounting Hardware Kit',
      modelNumber: `SCH-${clipCount}-PRO`,
      quantity: clipCount,
      length: '-',
      width: '-',
      colorFinish: params.color || 'Chrome',
      category: 'Hardware'
    });

    // Casters if mobile
    if (params.postType === 'Mobile') {
      items.push({
        description: 'Heavy Duty Swivel Casters (4" Premium Wheels)',
        modelNumber: `HDC-4-PRO-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
        quantity: 4,
        length: '4"',
        width: '4"',
        colorFinish: params.color || 'Chrome',
        category: 'Mobility'
      });
    }

    return items;
  };

  const bomItems = generateBOM();
  const estimatedWeight = bomItems.length > 0 ? 
    Math.round(params.width * params.length * params.numberOfShelves * 0.8 + params.postHeight * 2) : 0;

  const categoryColors = {
    'Structure': 'bg-slate-100 text-slate-800',
    'Shelving': 'bg-blue-100 text-blue-800',
    'Hardware': 'bg-amber-100 text-amber-800',
    'Mobility': 'bg-emerald-100 text-emerald-800'
  };

  return (
    <div className="premium-card">
      <div className="premium-header p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Bill of Materials</h3>
            <p className="text-slate-500 font-medium mt-1">Professional specification sheet</p>
          </div>
          {bomItems.length > 0 && (
            <div className="text-right">
              <div className="premium-spec-badge mb-2">
                <span className="text-sm">Est. Weight:</span>
                <span className="font-bold ml-2">{estimatedWeight} lbs</span>
              </div>
              <div className="premium-spec-badge">
                <span className="text-sm">Components:</span>
                <span className="font-bold ml-2">{bomItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {bomItems.length === 0 ? (
        <div className="premium-empty-state p-12">
          <div className="text-center">
            <div className="premium-empty-icon mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-slate-700 mb-2">Ready to Generate BOM</h4>
            <p className="text-slate-500 max-w-md mx-auto">Complete your configuration using our AI assistant to generate a detailed bill of materials with professional specifications.</p>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <div className="premium-table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Component Description</th>
                  <th>Model Number</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Length</th>
                  <th className="text-center">Width</th>
                  <th>Finish</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((item, index) => (
                  <tr key={index}>
                    <td className="font-semibold text-slate-800">{item.description}</td>
                    <td className="premium-model-number">{item.modelNumber}</td>
                    <td className="text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="text-center text-slate-600">{item.length}</td>
                    <td className="text-center text-slate-600">{item.width}</td>
                    <td>
                      <span className="premium-finish-badge">
                        {item.colorFinish}
                      </span>
                    </td>
                    <td>
                      <span className={`premium-category-badge ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Premium App Component
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

  const hasMinimumParams = shelfParams.width && shelfParams.length && shelfParams.postHeight && shelfParams.numberOfShelves;

  const updateShelfParams = (newParams) => {
    setShelfParams(newParams);
  };

  return (
    <div className="premium-app">
      {/* Premium Header */}
      <header className="premium-app-header">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="premium-brand">
              <h1 className="premium-title">Wire Shelves 3D Configurator</h1>
              <p className="premium-subtitle">Professional-grade shelving solutions with AI-powered design assistance</p>
            </div>
            <div className="premium-status-indicators">
              <div className="premium-indicator-ai">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                AI Powered
              </div>
              {hasMinimumParams && (
                <div className="premium-indicator-ready">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  3D Ready
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="premium-grid">
          {/* AI Chat Interface */}
          <div className="premium-grid-chat">
            <ChatInterface 
              onParametersExtracted={updateShelfParams}
              extractedParams={shelfParams}
              sessionId={sessionId}
            />
          </div>

          {/* 3D Viewer */}
          <div className="premium-grid-viewer">
            {hasMinimumParams ? (
              <div className="premium-card">
                <div className="premium-header p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">3D Visualization</h3>
                    <div className="premium-3d-badges">
                      <span className="premium-style-badge">{shelfParams.shelfStyle}</span>
                      <span className="premium-finish-badge">{shelfParams.color}</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <WireShelf3D {...shelfParams} />
                  <div className="premium-3d-footer">
                    <p>Interactive 3D Model • Photorealistic Rendering • Real-time Updates</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-card premium-empty-3d">
                <div className="premium-empty-state p-12">
                  <div className="text-center">
                    <div className="premium-empty-icon mb-6">
                      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21l3-3 3 3M9 5l3-3 3 3" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">3D Model Preview</h3>
                    <p className="text-lg text-slate-500 mb-6">Your personalized wire shelving unit will appear here once you provide the essential dimensions</p>
                    <div className="premium-requirements-card">
                      <h4 className="font-bold text-slate-700 mb-2">Required Information:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Width & Length dimensions
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Overall height specification
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Number of shelf levels
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="premium-grid-controls">
            <ParameterControls 
              params={shelfParams}
              onParamsChange={updateShelfParams}
            />
          </div>

          {/* Bill of Materials */}
          <div className="premium-grid-bom">
            <BillOfMaterials params={shelfParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;