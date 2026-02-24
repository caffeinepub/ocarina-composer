import { NoteName, OctaveRange } from '../types/music';
import { cn } from '../lib/utils';
import { isNoteInOcarinaRange } from '../utils/ocarinaNoteMapper';

interface PianoKeyboardProps {
  onNoteClick: (noteName: NoteName, octave: number) => void;
  disabled?: boolean;
  octaveRange: OctaveRange;
}

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const whiteNotes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotes: NoteName[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

// The piano always spans C3 to C7 (4 full octaves + top C)
const PIANO_START_OCTAVE = 3;
const PIANO_END_OCTAVE = 6; // generates C3-B6 + C7

export function PianoKeyboard({ onNoteClick, disabled, octaveRange }: PianoKeyboardProps) {
  const whiteKeys: { note: NoteName; octave: number }[] = [];
  const blackKeys: { note: NoteName; octave: number; position: number }[] = [];

  let whiteKeyIndex = 0;

  for (let octave = PIANO_START_OCTAVE; octave <= PIANO_END_OCTAVE; octave++) {
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

  // Add the final C7 key
  whiteKeys.push({ note: 'C', octave: PIANO_END_OCTAVE + 1 });

  const baseOctave = octaveRange.start;

  return (
    <div className="space-y-2">
      {/* Octave range legend */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary/20 border border-primary/40" />
          Active ocarina range (C{baseOctave}–C{baseOctave + 1})
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-white border border-gray-300" />
          Outside range (playable)
        </span>
      </div>

      <div className="relative inline-block">
        {/* White keys */}
        <div className="flex gap-0.5">
          {whiteKeys.map((key) => {
            const inRange = isNoteInOcarinaRange(key.note, key.octave, baseOctave);
            const isRootNote = key.note === 'C' && key.octave === baseOctave;
            const isTopNote = key.note === 'C' && key.octave === baseOctave + 1;

            return (
              <button
                key={`${key.note}${key.octave}`}
                onClick={() => onNoteClick(key.note, key.octave)}
                disabled={disabled}
                title={`${key.note}${key.octave}`}
                className={cn(
                  'w-10 h-40 border-2 rounded-b-lg',
                  'transition-colors duration-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-end justify-center pb-2 text-xs font-medium',
                  inRange
                    ? 'bg-amber-50 border-amber-400 hover:bg-amber-100 active:bg-amber-200 text-amber-800'
                    : 'bg-white border-gray-400 hover:bg-gray-100 active:bg-gray-200 text-gray-500',
                  (isRootNote || isTopNote) && 'border-amber-600 border-2'
                )}
              >
                {(isRootNote || isTopNote || key.note === 'C') && (
                  <span className={cn(
                    'text-[10px] font-semibold',
                    inRange ? 'text-amber-700' : 'text-gray-400'
                  )}>
                    {key.note}{key.octave}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Black keys */}
        <div className="absolute top-0 left-0 pointer-events-none">
          {blackKeys.map((key) => {
            const inRange = isNoteInOcarinaRange(key.note, key.octave, baseOctave);

            return (
              <button
                key={`${key.note}${key.octave}`}
                onClick={() => onNoteClick(key.note, key.octave)}
                disabled={disabled}
                title={`${key.note}${key.octave}`}
                className={cn(
                  'absolute h-24 rounded-b-lg border-2',
                  'transition-colors duration-100',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'pointer-events-auto',
                  'flex items-end justify-center pb-1 text-[9px] font-medium',
                  inRange
                    ? 'w-7 bg-amber-800 border-amber-900 hover:bg-amber-700 active:bg-amber-600 text-amber-100'
                    : 'w-7 bg-gray-900 border-gray-950 hover:bg-gray-800 active:bg-gray-700 text-gray-400'
                )}
                style={{ left: `${key.position * 2.625}rem` }}
              >
                {inRange && (
                  <span className="text-[8px] text-amber-200 opacity-80">
                    {key.note}{key.octave}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
