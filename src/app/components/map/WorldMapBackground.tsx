export function WorldMapBackground() {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-xl h-96 relative overflow-hidden border shadow-inner">
      {/* World Map SVG Background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* North America */}
          <path 
            d="M50 150 Q80 120 120 130 Q180 140 200 180 Q220 200 180 250 Q140 280 90 260 Q40 220 50 150 Z" 
            fill="rgba(255,255,255,0.3)" 
          />
          {/* South America */}
          <path 
            d="M180 300 Q200 280 220 320 Q240 380 220 440 Q200 460 180 450 Q160 420 160 380 Q160 340 180 300 Z" 
            fill="rgba(255,255,255,0.3)" 
          />
          {/* Europe */}
          <path 
            d="M400 100 Q450 80 480 120 Q500 140 480 170 Q460 180 420 160 Q390 140 400 100 Z" 
            fill="rgba(255,255,255,0.3)" 
          />
          {/* Africa */}
          <path 
            d="M420 180 Q480 170 500 220 Q520 280 500 350 Q480 400 450 380 Q420 340 410 280 Q400 220 420 180 Z" 
            fill="rgba(255,255,255,0.3)" 
          />
          {/* Asia */}
          <path 
            d="M520 80 Q620 60 720 100 Q800 120 820 180 Q840 220 800 250 Q760 270 720 260 Q680 250 640 230 Q580 200 550 160 Q520 120 520 80 Z" 
            fill="rgba(255,255,255,0.3)" 
          />
          {/* Australia */}
          <path 
            d="M720 350 Q780 340 820 370 Q840 390 820 410 Q780 420 740 400 Q720 380 720 350 Z" 
            fill="rgba(255,255,255,0.3)" 
          />
          
          {/* Ocean routes */}
          <path 
            d="M200 280 Q300 250 400 280 Q500 300 600 280 Q700 270 800 280" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
          <path 
            d="M150 200 Q250 180 350 200 Q450 220 550 200" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2" 
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-20 grid-rows-10 h-full">
          {Array.from({ length: 200 }).map((_, i) => (
            <div key={i} className="border border-white"></div>
          ))}
        </div>
      </div>
    </div>
  );
}