import { NoteName, OctaveRange } from '../types/music';
import { cn } from '../lib/utils';

interface PianoKeyboardProps {
  onNoteClick: (noteName: NoteName, octave: number) => void;
  disabled?: boolean;
  octaveRange: OctaveRange;
}

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const whiteNotes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotes: NoteName[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

export function PianoKeyboard({ onNoteClick, disabled, octaveRange }: PianoKeyboardProps) {
  // Generate keys based on octave range
  const whiteKeys: { note: NoteName; octave: number }[] = [];
  const blackKeys: { note: NoteName; octave: number; position: number }[] = [];
  
  let whiteKeyIndex = 0;
  
  for (let octave = octaveRange.start; octave <= octaveRange.end; octave++) {
    chromaticNotes.forEach((note) => {
      if (whiteNotes.includes(note)) {
        whiteKeys.push({ note, octave });
        
        // Calculate black key positions relative to white keys
        const nextNote = chromaticNotes[(chromaticNotes.indexOf(note) + 1) % 12];
        if (blackNotes.includes(nextNote as NoteName)) {
          blackKeys.push({
            note: nextNote as NoteName,
            octave,
            position: whiteKeyIndex + 0.7,
          });
        }
        
        whiteKeyIndex++;
      }
    });
  }
  
  // Add one more C key from the next octave (highest note)
  const nextOctave = octaveRange.end + 1;
  whiteKeys.push({ note: 'C', octave: nextOctave });

  return (
    <div className="relative inline-block">
      <div className="flex gap-0.5">
        {whiteKeys.map((key) => (
          <button
            key={`${key.note}${key.octave}`}
            onClick={() => onNoteClick(key.note, key.octave)}
            disabled={disabled}
            className={cn(
              'w-16 h-48 bg-white border-2 border-gray-800 rounded-b-lg',
              'hover:bg-gray-100 active:bg-gray-200',
              'transition-colors duration-100',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-end justify-center pb-4 text-sm font-medium text-gray-700'
            )}
          >
            {key.note}{key.octave}
          </button>
        ))}
      </div>
      
      <div className="absolute top-0 left-0 pointer-events-none">
        {blackKeys.map((key) => (
          <button
            key={`${key.note}${key.octave}`}
            onClick={() => onNoteClick(key.note, key.octave)}
            disabled={disabled}
            className={cn(
              'absolute w-10 h-32 bg-gray-900 border-2 border-gray-950 rounded-b-lg',
              'hover:bg-gray-800 active:bg-gray-700',
              'transition-colors duration-100',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'pointer-events-auto',
              'flex items-end justify-center pb-2 text-xs font-medium text-white'
            )}
            style={{ left: `${key.position * 4.125}rem` }}
          >
            {key.note}{key.octave}
          </button>
        ))}
      </div>
    </div>
  );
}
