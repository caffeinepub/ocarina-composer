import { Note, FingeringConfiguration } from '../types/music';
import { getNoteFingerPattern } from '../utils/ocarinaNoteMapper';

interface OcarinaIllustrationProps {
  note: Note | null;
  fingeringConfig: FingeringConfiguration;
}

export function OcarinaIllustration({ note, fingeringConfig }: OcarinaIllustrationProps) {
  const fingering = note ? getNoteFingerPattern(note.name, note.octave, fingeringConfig) : null;
  
  // 4 holes arranged in a square formation centered in the ocarina
  // Center of SVG is at 170, 110
  // Square size: 60x60 pixels
  const squareOffset = 30; // Half of square size
  
  // Rotated 90 degrees clockwise:
  // Top-left: Hole 3 (leftMiddle) - was bottom-left
  // Top-right: Hole 1 (rightMiddle) - was top-left
  // Bottom-right: Hole 2 (rightIndex) - was top-right
  // Bottom-left: Hole 4 (leftIndex) - was bottom-right
  const holes = [
    // Top-left corner: Hole 3 (bigger) - leftMiddle
    { x: 170 - squareOffset, y: 110 - squareOffset, label: '3', key: 'leftMiddle' as const, radius: 20 },
    // Top-right corner: Hole 1 (smallest) - rightMiddle
    { x: 170 + squareOffset, y: 110 - squareOffset, label: '1', key: 'rightMiddle' as const, radius: 14 },
    // Bottom-right corner: Hole 2 (slightly bigger) - rightIndex
    { x: 170 + squareOffset, y: 110 + squareOffset, label: '2', key: 'rightIndex' as const, radius: 17 },
    // Bottom-left corner: Hole 4 (bigger) - leftIndex
    { x: 170 - squareOffset, y: 110 + squareOffset, label: '4', key: 'leftIndex' as const, radius: 20 },
  ];
  
  return (
    <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-amber-900">
          {note ? `${note.name}${note.octave}` : 'Select a note'}
        </h3>
        <p className="text-sm text-amber-700">4-Hole Ocarina</p>
      </div>
      
      {/* Ocarina body */}
      <svg width="340" height="240" viewBox="0 0 340 240" className="mx-auto">
        {/* Round ocarina body */}
        <circle
          cx="170"
          cy="110"
          r="100"
          fill="#d97706"
          stroke="#92400e"
          strokeWidth="3"
        />
        
        {/* Mouthpiece at bottom */}
        <rect
          x="150"
          y="195"
          width="40"
          height="30"
          rx="5"
          fill="#b45309"
          stroke="#92400e"
          strokeWidth="2"
        />
        
        {/* Holes arranged in square formation */}
        {holes.map(({ x, y, label, key, radius }) => {
          const isClosed = fingering ? fingering[key] : false;
          
          return (
            <g key={key}>
              {/* Hole circle */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={isClosed ? '#1f2937' : '#fef3c7'}
                stroke="#92400e"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              {/* Hole number label */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill={isClosed ? '#fef3c7' : '#92400e'}
                className="transition-all duration-300"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="text-center mt-4 text-sm text-amber-800">
        <p className="font-medium">● Closed hole &nbsp;&nbsp; ○ Open hole</p>
        <p className="text-xs mt-1">Top: Middle(3), Middle(1) | Bottom: Index(4), Index(2)</p>
      </div>
    </div>
  );
}
