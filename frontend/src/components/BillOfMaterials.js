import React from 'react';

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

    // Wire Shelves
    const wireShelfCount = params.solidBottomShelf ? params.numberOfShelves - 1 : params.numberOfShelves;
    if (wireShelfCount > 0) {
      items.push({
        description: `Wire Shelves - ${params.shelfStyle || 'Standard'} Pattern`,
        modelNumber: `WS-${params.width}x${params.length}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
        quantity: wireShelfCount,
        length: `${params.length}"`,
        width: `${params.width}"`,
        colorFinish: params.color || 'Chrome',
        category: 'Shelving'
      });
    }

    // Solid Bottom Shelf
    if (params.solidBottomShelf) {
      items.push({
        description: `Solid Bottom Shelf - Reinforced`,
        modelNumber: `SS-${params.width}x${params.length}-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
        quantity: 1,
        length: `${params.length}"`,
        width: `${params.width}"`,
        colorFinish: params.color || 'Chrome',
        category: 'Shelving'
      });
    }

    // Mobile Casters
    if (params.postType === 'Mobile') {
      items.push({
        description: `Heavy Duty Swivel Casters with Brakes`,
        modelNumber: `HDC-5-TB`,
        quantity: 4,
        length: `5"`,
        width: `5"`,
        colorFinish: 'Black',
        category: 'Mobility'
      });
    }

    // Shelf Dividers
    if (params.shelfDividersCount > 0 && params.shelfDividersShelves?.length > 0) {
      const totalDividers = params.shelfDividersCount * params.shelfDividersShelves.length;
      items.push({
        description: `Shelf Dividers - Clip-On Style`,
        modelNumber: `SD-8H-${params.color?.replace(/\s+/g, '') || 'Chrome'}`,
        quantity: totalDividers,
        length: `8"`,
        width: `0.5"`,
        colorFinish: params.color || 'Chrome',
        category: 'Organization'
      });
    }

    // Enclosure Panels
    if (params.enclosureType !== 'none') {
      if (params.enclosureType === 'back' || params.enclosureType === 'full') {
        items.push({
          description: `Back Enclosure Panel - Clear Polycarbonate`,
          modelNumber: `EP-${params.width}x${params.postHeight}-CLR`,
          quantity: 1,
          length: `${params.postHeight}"`,
          width: `${params.width}"`,
          colorFinish: 'Clear',
          category: 'Enclosure'
        });
      }
      
      if (params.enclosureType === 'sides' || params.enclosureType === 'full') {
        items.push({
          description: `Side Enclosure Panels - Clear Polycarbonate`,
          modelNumber: `EP-${params.length}x${params.postHeight}-CLR`,
          quantity: 2,
          length: `${params.postHeight}"`,
          width: `${params.length}"`,
          colorFinish: 'Clear',
          category: 'Enclosure'
        });
      }
    }

    // Hardware Kit
    items.push({
      description: `Assembly Hardware Kit - Bolts, Nuts, Washers`,
      modelNumber: `HK-${params.shelfStyle?.replace(/\s+/g, '') || 'Standard'}`,
      quantity: 1,
      length: `N/A`,
      width: `N/A`,
      colorFinish: params.color || 'Chrome',
      category: 'Hardware'
    });

    return items;
  };

  const bomItems = generateBOM();
  
  // Calculate estimated weight
  const estimatedWeight = bomItems.reduce((total, item) => {
    let itemWeight = 0;
    switch (item.category) {
      case 'Structure': itemWeight = 8 * item.quantity; break;
      case 'Shelving': itemWeight = item.description.includes('Solid') ? 12 * item.quantity : 6 * item.quantity; break;
      case 'Mobility': itemWeight = 3 * item.quantity; break;
      case 'Organization': itemWeight = 0.5 * item.quantity; break;
      case 'Enclosure': itemWeight = 4 * item.quantity; break;
      case 'Hardware': itemWeight = 2; break;
      default: itemWeight = 1;
    }
    return total + itemWeight;
  }, 0);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Structure':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Shelving':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'Mobility':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'Organization':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'Enclosure':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'Hardware':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
    }
  };

  return (
    <div className="premium-card">
      <div className="premium-header p-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Bill of Materials</h3>
            <p className="text-gray-300 font-medium text-sm mt-0">Professional specification sheet</p>
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
        <div className="premium-empty-state p-6">
          <div className="text-center">
            <div className="premium-empty-icon mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Ready to Generate BOM</h4>
            <p className="text-gray-300 max-w-md mx-auto text-sm">Complete your configuration using our AI assistant to generate a detailed bill of materials with professional specifications.</p>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-3">
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
                    <td className="font-semibold text-white">{item.description}</td>
                    <td className="premium-model-number">{item.modelNumber}</td>
                    <td className="text-center font-bold text-gray-200">{item.quantity}</td>
                    <td className="text-center text-gray-300">{item.length}</td>
                    <td className="text-center text-gray-300">{item.width}</td>
                    <td>
                      <span className="premium-finish-badge">
                        {item.colorFinish}
                      </span>
                    </td>
                    <td>
                      <span className="premium-category-badge">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="text-sm font-bold text-white mb-2">Assembly Notes</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• All components include necessary mounting hardware</li>
              <li>• Assembly time: approximately 2-3 hours with basic tools</li>
              <li>• Weight capacity: {params.shelfStyle === 'Heavy Duty' ? '500' : '350'} lbs per shelf when evenly distributed</li>
              <li>• Recommended tools: Phillips screwdriver, adjustable wrench, level</li>
              {params.postType === 'Mobile' && <li>• Casters include total-lock brakes for stability</li>}
              {params.enclosureType !== 'none' && <li>• Enclosure panels are removable for easy cleaning</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillOfMaterials;
