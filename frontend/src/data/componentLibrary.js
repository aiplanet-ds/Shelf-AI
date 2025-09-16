// Component Knowledge Base - Hardcoded data for manufacturing analysis
export const componentLibrary = [
  {
    id: 1,
    name: "Heavy Duty Wire Shelf",
    category: "Shelving",
    loadCapacity: "500kg",
    dimensions: "48x24x1.5",
    material: "Stainless Steel",
    compatibilityScore: 95,
    applications: ["warehouse", "industrial", "automotive"],
    environment: ["standard", "humid", "chemical-resistant"],
    thumbnail: "/components/heavy-duty-shelf.jpg",
    specifications: {
      wireGauge: "10 gauge",
      finish: "Electropolished",
      temperature: "-40°C to 200°C",
      certification: "NSF, FDA"
    },
    cost: 89.99,
    leadTime: "5-7 days",
    description: "Industrial-grade wire shelf designed for heavy-duty applications with superior load capacity and corrosion resistance."
  },
  {
    id: 2,
    name: "Anti-Static Wire Shelf",
    category: "Shelving",
    loadCapacity: "300kg",
    dimensions: "36x18x1.5",
    material: "Conductive Steel",
    compatibilityScore: 88,
    applications: ["electronics", "cleanroom", "laboratory"],
    environment: ["cleanroom", "esd-safe", "controlled"],
    thumbnail: "/components/anti-static-shelf.jpg",
    specifications: {
      wireGauge: "12 gauge",
      finish: "Conductive Coating",
      resistance: "10^6 ohms",
      certification: "ESD S20.20"
    },
    cost: 124.99,
    leadTime: "7-10 days",
    description: "Specialized wire shelf with anti-static properties for sensitive electronic component storage."
  },
  {
    id: 3,
    name: "Food Grade Wire Shelf",
    category: "Shelving",
    loadCapacity: "400kg",
    dimensions: "42x21x1.5",
    material: "316 Stainless Steel",
    compatibilityScore: 92,
    applications: ["food-service", "medical", "pharmaceutical"],
    environment: ["food-safe", "washdown", "sterile"],
    thumbnail: "/components/food-grade-shelf.jpg",
    specifications: {
      wireGauge: "11 gauge",
      finish: "Electropolished",
      temperature: "-40°C to 150°C",
      certification: "NSF, FDA, USDA"
    },
    cost: 109.99,
    leadTime: "3-5 days",
    description: "FDA-approved wire shelf for food service and medical applications with easy cleaning design."
  },
  {
    id: 4,
    name: "Mobile Caster Set",
    category: "Mobility",
    loadCapacity: "600kg",
    dimensions: "5x5x6",
    material: "Polyurethane/Steel",
    compatibilityScore: 85,
    applications: ["mobile", "warehouse", "manufacturing"],
    environment: ["standard", "industrial", "smooth-floors"],
    thumbnail: "/components/mobile-casters.jpg",
    specifications: {
      wheelDiameter: "5 inches",
      swivel: "360°",
      brake: "Total lock",
      bearing: "Precision ball"
    },
    cost: 159.99,
    leadTime: "2-3 days",
    description: "Heavy-duty caster set for mobile shelving units with precision bearings and total lock brakes."
  },
  {
    id: 5,
    name: "Adjustable Post 72\"",
    category: "Structure",
    loadCapacity: "800kg",
    dimensions: "1.5x1.5x72",
    material: "Chrome Steel",
    compatibilityScore: 90,
    applications: ["adjustable", "modular", "warehouse"],
    environment: ["standard", "humid", "industrial"],
    thumbnail: "/components/adjustable-post.jpg",
    specifications: {
      adjustment: "1-inch increments",
      finish: "Chrome plated",
      wallThickness: "16 gauge",
      slots: "Every inch"
    },
    cost: 45.99,
    leadTime: "1-2 days",
    description: "Versatile adjustable post with 1-inch increment positioning for flexible shelf configurations."
  },
  {
    id: 6,
    name: "Solid Bottom Shelf",
    category: "Shelving",
    loadCapacity: "450kg",
    dimensions: "48x24x1",
    material: "Galvanized Steel",
    compatibilityScore: 87,
    applications: ["solid-storage", "small-parts", "retail"],
    environment: ["standard", "dry", "indoor"],
    thumbnail: "/components/solid-shelf.jpg",
    specifications: {
      thickness: "18 gauge",
      finish: "Galvanized",
      edges: "Reinforced",
      surface: "Smooth"
    },
    cost: 67.99,
    leadTime: "3-4 days",
    description: "Solid steel shelf for small parts storage with reinforced edges and smooth surface finish."
  },
  {
    id: 7,
    name: "Shelf Divider Set",
    category: "Organization",
    loadCapacity: "50kg",
    dimensions: "24x8x0.5",
    material: "Chrome Steel",
    compatibilityScore: 75,
    applications: ["organization", "separation", "retail"],
    environment: ["standard", "indoor", "light-duty"],
    thumbnail: "/components/shelf-dividers.jpg",
    specifications: {
      height: "8 inches",
      attachment: "Clip-on",
      finish: "Chrome",
      quantity: "Set of 4"
    },
    cost: 29.99,
    leadTime: "1-2 days",
    description: "Clip-on shelf dividers for organizing and separating items on wire shelves."
  },
  {
    id: 8,
    name: "Corner Connector",
    category: "Hardware",
    loadCapacity: "400kg",
    dimensions: "3x3x3",
    material: "Die-Cast Zinc",
    compatibilityScore: 82,
    applications: ["corner", "connection", "structural"],
    environment: ["standard", "indoor", "dry"],
    thumbnail: "/components/corner-connector.jpg",
    specifications: {
      angle: "90 degrees",
      finish: "Chrome plated",
      mounting: "4-bolt",
      material: "Zinc alloy"
    },
    cost: 19.99,
    leadTime: "1-2 days",
    description: "Heavy-duty corner connector for creating L-shaped and corner shelf configurations."
  },
  {
    id: 9,
    name: "LED Light Strip",
    category: "Lighting",
    loadCapacity: "N/A",
    dimensions: "48x1x0.5",
    material: "Aluminum/LED",
    compatibilityScore: 70,
    applications: ["lighting", "visibility", "inspection"],
    environment: ["standard", "indoor", "controlled"],
    thumbnail: "/components/led-strip.jpg",
    specifications: {
      lumens: "3000",
      color: "Cool white",
      voltage: "24V DC",
      mounting: "Magnetic"
    },
    cost: 79.99,
    leadTime: "3-5 days",
    description: "Magnetic LED light strip for improved visibility and inspection capabilities."
  },
  {
    id: 10,
    name: "Enclosure Panel",
    category: "Enclosure",
    loadCapacity: "N/A",
    dimensions: "48x72x0.25",
    material: "Polycarbonate",
    compatibilityScore: 78,
    applications: ["enclosure", "protection", "cleanroom"],
    environment: ["cleanroom", "controlled", "sterile"],
    thumbnail: "/components/enclosure-panel.jpg",
    specifications: {
      transparency: "Clear",
      thickness: "0.25 inches",
      mounting: "Clip-on",
      certification: "FDA approved"
    },
    cost: 149.99,
    leadTime: "5-7 days",
    description: "Clear polycarbonate enclosure panel for creating protected storage environments."
  }
];

// Compatibility scoring algorithm
export const calculateCompatibilityScore = (component, problemStatement) => {
  let score = component.compatibilityScore;
  const statement = problemStatement.toLowerCase();
  
  // Boost score based on keyword matches
  component.applications.forEach(app => {
    if (statement.includes(app)) score += 5;
  });
  
  component.environment.forEach(env => {
    if (statement.includes(env)) score += 3;
  });
  
  // Load capacity matching
  if (statement.includes('heavy') && parseInt(component.loadCapacity) > 400) score += 8;
  if (statement.includes('light') && parseInt(component.loadCapacity) < 200) score += 5;
  
  // Material preferences
  if (statement.includes('stainless') && component.material.includes('Stainless')) score += 10;
  if (statement.includes('food') && component.material.includes('316')) score += 10;
  if (statement.includes('anti-static') && component.material.includes('Conductive')) score += 15;
  
  return Math.min(100, Math.max(0, score));
};

// Filter functions
export const filterComponents = (components, filters) => {
  return components.filter(component => {
    // Category filter
    if (filters.category && filters.category !== 'all' && component.category !== filters.category) {
      return false;
    }
    
    // Load capacity filter
    if (filters.loadCapacity) {
      const capacity = parseInt(component.loadCapacity);
      switch (filters.loadCapacity) {
        case 'light': return capacity <= 200;
        case 'medium': return capacity > 200 && capacity <= 400;
        case 'heavy': return capacity > 400;
        default: return true;
      }
    }
    
    // Environment filter
    if (filters.environment && filters.environment !== 'all') {
      return component.environment.includes(filters.environment);
    }
    
    // Material filter
    if (filters.material && filters.material !== 'all') {
      return component.material.toLowerCase().includes(filters.material.toLowerCase());
    }
    
    // Search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      return (
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.applications.some(app => app.includes(query)) ||
        component.material.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};
