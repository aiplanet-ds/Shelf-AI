import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { saveAs } from 'file-saver';

// Enhanced Wire Shelf 3D Component with premium materials
const WireShelf3D = forwardRef(({ width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf, postType, shelfDividersCount, shelfDividersShelves, enclosureType }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const shelfGroupRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create premium materials based on color and style
  const createPremiumMaterials = (color, style) => {
    const materials = {};
    
    // Base material properties for premium look
    const baseProps = {
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1
    };

    // Color mapping with premium finishes
    const colorMap = {
      'Chrome': { color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 },
      'Stainless Steel': { color: 0xb8b8b8, metalness: 0.8, roughness: 0.2 },
      'Black': { color: 0x2a2a2a, metalness: 0.7, roughness: 0.3 },
      'White': { color: 0xf5f5f5, metalness: 0.1, roughness: 0.4 },
      'Zinc': { color: 0xa8a8a8, metalness: 0.6, roughness: 0.3 }
    };

    const colorProps = colorMap[color] || colorMap['Chrome'];
    
    // Post material
    materials.post = new THREE.MeshPhysicalMaterial({
      ...baseProps,
      ...colorProps,
      envMapIntensity: 1.2
    });

    // Wire material (slightly different for visual distinction)
    materials.wire = new THREE.MeshPhysicalMaterial({
      ...baseProps,
      ...colorProps,
      metalness: colorProps.metalness * 0.9,
      roughness: colorProps.roughness * 1.1,
      envMapIntensity: 1.0
    });

    // Solid shelf material
    materials.solid = new THREE.MeshPhysicalMaterial({
      ...baseProps,
      ...colorProps,
      metalness: colorProps.metalness * 0.8,
      roughness: colorProps.roughness * 1.2,
      envMapIntensity: 0.8
    });

    return materials;
  };

  useEffect(() => {
    if (!mountRef.current || !width || !length || !postHeight || !numberOfShelves) {
      setIsLoading(false);
      return;
    }

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Add a small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      try {
        // Clear previous render
        if (rendererRef.current) {
          if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
          rendererRef.current.dispose();
        }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup with better positioning
    const camera = new THREE.PerspectiveCamera(45, 1200 / 800, 0.1, 1000);
    const maxDimension = Math.max(width, length, postHeight);
    camera.position.set(maxDimension * 1.5, maxDimension * 1.2, maxDimension * 1.5);
    camera.lookAt(0, postHeight / 2, 0);

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Rim lighting for premium effect
    const rimLight = new THREE.DirectionalLight(0x4ade80, 0.3);
    rimLight.position.set(-50, 30, -50);
    scene.add(rimLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
    fillLight.position.set(0, -50, 0);
    scene.add(fillLight);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(1200, 800);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Safely append renderer to mount point
    if (mountRef.current && !mountRef.current.contains(renderer.domElement)) {
      mountRef.current.appendChild(renderer.domElement);
    }

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
      const shelfY = shelfSpacing * (i + 1);
      
      if (solidBottomShelf && i === 0) {
        // Solid bottom shelf
        const solidGeometry = new THREE.BoxGeometry(width, 0.1, length);
        const solidShelf = new THREE.Mesh(solidGeometry, materials.solid);
        solidShelf.position.set(0, shelfY, 0);
        solidShelf.castShadow = true;
        solidShelf.receiveShadow = true;
        
        // Add reinforced edges
        const edgeGeometry = new THREE.BoxGeometry(width, 0.2, 0.2);
        const frontEdge = new THREE.Mesh(edgeGeometry, materials.post);
        frontEdge.position.set(0, shelfY, length/2);
        const backEdge = new THREE.Mesh(edgeGeometry, materials.post);
        backEdge.position.set(0, shelfY, -length/2);
        
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
        
        shelfGroup.add(wireGroup);
      }

      // Add shelf dividers if specified
      if (shelfDividersCount > 0 && shelfDividersShelves.includes(i + 1)) {
        const dividerSpacing = width / (shelfDividersCount + 1);
        for (let d = 0; d < shelfDividersCount; d++) {
          const dividerX = -width/2 + dividerSpacing * (d + 1);
          const dividerGeometry = new THREE.BoxGeometry(0.1, 8, length * 0.8);
          const divider = new THREE.Mesh(dividerGeometry, materials.post);
          divider.position.set(dividerX, shelfY + 4, 0);
          divider.castShadow = true;
          divider.receiveShadow = true;
          shelfGroup.add(divider);
        }
      }
    }

    // Add mobile casters if specified
    if (postType === 'Mobile') {
      const casterRadius = 1.5;
      const casterGeometry = new THREE.CylinderGeometry(casterRadius, casterRadius, 0.8, 16);
      const casterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        metalness: 0.1,
        roughness: 0.8
      });

      postPositions.forEach(pos => {
        const caster = new THREE.Mesh(casterGeometry, casterMaterial);
        caster.position.set(pos[0], casterRadius/2, pos[2]);
        caster.castShadow = true;
        caster.receiveShadow = true;
        shelfGroup.add(caster);
      });
    }

    // Add enclosure panels if specified
    if (enclosureType !== 'none') {
      const panelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        metalness: 0.0,
        roughness: 0.1
      });

      if (enclosureType === 'full' || enclosureType === 'sides') {
        // Side panels
        const sidePanelGeometry = new THREE.PlaneGeometry(length, postHeight);
        const leftPanel = new THREE.Mesh(sidePanelGeometry, panelMaterial);
        leftPanel.position.set(-width/2, postHeight/2, 0);
        leftPanel.rotation.y = Math.PI/2;
        const rightPanel = new THREE.Mesh(sidePanelGeometry, panelMaterial);
        rightPanel.position.set(width/2, postHeight/2, 0);
        rightPanel.rotation.y = -Math.PI/2;
        shelfGroup.add(leftPanel, rightPanel);
      }

      if (enclosureType === 'full' || enclosureType === 'back') {
        // Back panel
        const backPanelGeometry = new THREE.PlaneGeometry(width, postHeight);
        const backPanel = new THREE.Mesh(backPanelGeometry, panelMaterial);
        backPanel.position.set(0, postHeight/2, -length/2);
        shelfGroup.add(backPanel);
      }
    }

    scene.add(shelfGroup);
    shelfGroupRef.current = shelfGroup;

    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI / 2;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

        // Set loading complete
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing 3D scene:', error);
        setError('Failed to load 3D model. Please refresh the page.');
        setIsLoading(false);
      }
    }, 100); // Small delay to ensure DOM is ready

    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (rendererRef.current) {
        try {
          if (mountRef.current && rendererRef.current.domElement && mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
          rendererRef.current.dispose();
          rendererRef.current = null;
        } catch (error) {
          console.warn('Error during Three.js cleanup:', error);
        }
      }
      // Clear scene references
      if (shelfGroupRef.current) {
        shelfGroupRef.current = null;
      }
    };
  }, [width, length, postHeight, numberOfShelves, color, shelfStyle, solidBottomShelf, postType, shelfDividersCount, enclosureType]);

  // Expose export functionality through ref
  useImperativeHandle(ref, () => ({
    exportSTL: () => {
      if (!shelfGroupRef.current) {
        console.error('Shelf model not ready for export');
        return;
      }

      try {
        const exporter = new STLExporter();
        const stlString = exporter.parse(shelfGroupRef.current);
        const blob = new Blob([stlString], { type: 'text/plain' });
        
        // Generate filename with shelf specifications
        const filename = `shelf_${width}x${length}x${postHeight}_${numberOfShelves}shelves.stl`;
        saveAs(blob, filename);
      } catch (error) {
        console.error('Error exporting STL:', error);
        alert('Error exporting 3D model. Please try again.');
      }
    },
    downloadSTL: () => {
      if (!shelfGroupRef.current) {
        console.error('Shelf model not ready for export');
        return;
      }

      try {
        const exporter = new STLExporter();
        const stlString = exporter.parse(shelfGroupRef.current);
        const blob = new Blob([stlString], { type: 'text/plain' });
        
        // Generate filename with shelf specifications
        const filename = `shelf_${width}x${length}x${postHeight}_${numberOfShelves}shelves.stl`;
        saveAs(blob, filename);
      } catch (error) {
        console.error('Error exporting STL:', error);
        alert('Error exporting 3D model. Please try again.');
      }
    }
  }), [width, length, postHeight, numberOfShelves]);

  return (
    <div className="premium-3d-container">
      {isLoading && (
        <div className="premium-3d-loading">
          <div className="premium-loading-spinner"></div>
          <p className="premium-loading-text">Loading 3D Model...</p>
        </div>
      )}
      {error && (
        <div className="premium-3d-error">
          <div className="premium-error-icon">⚠️</div>
          <p className="premium-error-text">{error}</p>
          <button
            className="premium-retry-btn"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      )}
      <div
        ref={mountRef}
        className="rounded-2xl overflow-hidden shadow-premium"
        style={{ display: isLoading || error ? 'none' : 'block' }}
      />
    </div>
  );
});

export default WireShelf3D;
