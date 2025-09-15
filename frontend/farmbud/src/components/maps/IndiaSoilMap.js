import React, { useState } from 'react';

const soilRegions = [
  { id: 'Mountain', name: 'Forest & Mountain Soil', path: "M205,2 L213,10 L250,12 L300,45 L360,60 L400,90 L450,120 L480,110 L500,130 L520,160 L480,180 L420,170 L380,150 L350,120 L320,100 L280,80 L250,60 L220,40 L205,20 Z" },
  { id: 'Alluvial', name: 'Alluvial Soil', path: "M150,80 L280,80 L320,100 L350,120 L420,170 L480,180 L520,160 L550,180 L600,220 L650,250 L700,280 L750,290 L700,320 L650,330 L600,310 L550,280 L500,250 L450,220 L350,150 L250,100 L150,80 Z" },
  { id: 'Arid', name: 'Arid Soil', path: "M100,120 L150,80 L250,100 L220,200 L180,250 L140,300 L100,250 L100,120 Z" },
  { id: 'Red and Yellow', name: 'Red & Yellow Soil', path: "M250,280 L400,350 L500,400 L600,450 L650,550 L600,600 L500,620 L400,600 L350,550 L300,450 L250,350 L250,280 Z" },
  { id: 'Black', name: 'Black Soil', path: "M180,250 L220,200 L250,280 L300,450 L350,550 L400,600 L350,620 L300,600 L250,550 L180,400 L180,250 Z" },
  { id: 'Laterite', name: 'Laterite Soil', path: "M150,500 L180,550 L250,650 L220,680 L180,650 L150,600 L150,500 Z M650,250 L700,280 L720,270 L680,240 L650,250 Z" }
];

const soilColorMapping = {
  'Alluvial': 'hsl(var(--primary) / 0.4)',
  'Black': 'hsl(var(--muted-foreground) / 0.6)',
  'Red and Yellow': 'hsl(25, 95%, 53%, 0.5)',
  'Laterite': 'hsl(0, 70%, 50%, 0.6)',
  'Arid': 'hsl(48, 95%, 61%, 0.4)',
  'Mountain': 'hsl(var(--foreground) / 0.3)',
};

const IndiaSoilMap = () => {
  const [hoveredSoil, setHoveredSoil] = useState(null);

  return (
    <div className="relative w-full h-full p-4 flex flex-col items-center justify-center bg-transparent">
      <svg
        viewBox="0 0 800 700"
        className="w-full h-auto max-h-[300px] drop-shadow-lg"
      >
        <g stroke="hsl(var(--background))" strokeWidth="1">
          {soilRegions.map((region) => (
            <path
              key={region.id}
              d={region.path}
              fill={soilColorMapping[region.id]}
              onMouseEnter={() => setHoveredSoil(region.name)}
              onMouseLeave={() => setHoveredSoil(null)}
              className="transition-opacity duration-200"
              style={{ opacity: hoveredSoil && hoveredSoil !== region.name ? 0.5 : 1 }}
            />
          ))}
        </g>
      </svg>
      <div className="w-full mt-4 p-2 rounded-md text-center h-10">
        <p className="text-lg font-semibold text-primary transition-opacity duration-200">
          {hoveredSoil || 'Hover over a region'}
        </p>
      </div>
    </div>
  );
};

export default IndiaSoilMap;