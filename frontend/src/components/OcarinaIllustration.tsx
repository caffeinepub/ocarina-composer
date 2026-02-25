import { Note, FingeringConfiguration, OctaveRange } from '../types/music';
import { getNoteFingerPattern } from '../utils/ocarinaNoteMapper';

interface OcarinaIllustrationProps {
  note: Note | null;
  fingeringConfig: FingeringConfiguration;
  octaveRange: OctaveRange;
}

export function OcarinaIllustration({ note, fingeringConfig, octaveRange }: OcarinaIllustrationProps) {
  const fingering = note
    ? getNoteFingerPattern(note.name, note.octave, fingeringConfig, octaveRange.start)
    : null;

  // Holes arranged in a square formation, rotated 90° clockwise
  const squareOffset = 30;
  const cx = 170;
  const cy = 110;

  const holes = [
    { x: cx - squareOffset, y: cy - squareOffset, label: '3', key: 'leftMiddle'  as const, radius: 20 },
    { x: cx + squareOffset, y: cy - squareOffset, label: '1', key: 'rightMiddle' as const, radius: 14 },
    { x: cx + squareOffset, y: cy + squareOffset, label: '2', key: 'rightIndex'  as const, radius: 17 },
    { x: cx - squareOffset, y: cy + squareOffset, label: '4', key: 'leftIndex'   as const, radius: 20 },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-amber-900">
          {note ? `${note.name}${note.octave}` : 'Select a note'}
        </h3>
        <p className="text-sm text-amber-700">4-Hole Ocarina</p>
      </div>

      <svg width="340" height="240" viewBox="0 0 340 240" className="mx-auto">
        {/* Ocarina body */}
        <circle cx={cx} cy={cy} r="100" fill="#d97706" stroke="#92400e" strokeWidth="3" />

        {/* Mouthpiece */}
        <rect x="150" y="195" width="40" height="30" rx="5" fill="#b45309" stroke="#92400e" strokeWidth="2" />

        {/* Holes */}
        {holes.map(({ x, y, label, key, radius }) => {
          const isClosed = fingering ? fingering[key] : false;
          return (
            <g key={key}>
              <circle
                cx={x} cy={y} r={radius}
                fill={isClosed ? '#1f2937' : '#fef3c7'}
                stroke="#92400e" strokeWidth="2"
                className="transition-all duration-300"
              />
              <text
                x={x} y={y + 5}
                textAnchor="middle" fontSize="14" fontWeight="bold"
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
        <p className="text-xs mt-1">
          Octave: C{octaveRange.start}–C{octaveRange.end} &nbsp;|&nbsp; Fingering applies to all octaves
        </p>
      </div>
    </div>
  );
}
