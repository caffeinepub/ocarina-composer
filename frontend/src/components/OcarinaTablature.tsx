import { Note, FingeringConfiguration, OctaveRange } from '../types/music';
import { getNoteFingerPattern } from '../utils/ocarinaNoteMapper';
import { cn } from '../lib/utils';

interface OcarinaTablatureProps {
  notes: Note[];
  currentPlayingNoteIndex: number | null;
  fingeringConfig: FingeringConfiguration;
  octaveRange: OctaveRange;
}

export function OcarinaTablature({
  notes,
  currentPlayingNoteIndex,
  fingeringConfig,
  octaveRange,
}: OcarinaTablatureProps) {
  if (notes.length === 0) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-1 text-amber-900">Ocarina Tablature</h3>
      <p className="text-xs text-amber-700 mb-4">
        Fingering configuration is shared across all octaves
      </p>
      <div className="flex flex-wrap gap-8">
        {notes.map((note, index) => {
          const fingering = getNoteFingerPattern(
            note.name,
            note.octave,
            fingeringConfig,
            octaveRange.start
          );
          const isPlaying = currentPlayingNoteIndex === index;

          return (
            <div key={note.id} className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className="text-sm font-medium text-amber-900">
                {note.name}{note.octave}
              </div>

              {/* 4 holes in square grid matching the rotated illustration layout */}
              <div className="grid grid-cols-2 gap-3">
                {/* Top-left: Hole 3 (leftMiddle) */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                    fingering.leftMiddle
                      ? 'bg-amber-900 border-amber-900'
                      : 'bg-white border-amber-900',
                    isPlaying && 'ring-4 ring-amber-400'
                  )}
                >
                  <span className={cn('text-xs font-bold', fingering.leftMiddle ? 'text-amber-50' : 'text-amber-900')}>3</span>
                </div>

                {/* Top-right: Hole 1 (rightMiddle) */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center',
                    fingering.rightMiddle
                      ? 'bg-amber-900 border-amber-900'
                      : 'bg-white border-amber-900',
                    isPlaying && 'ring-4 ring-amber-400'
                  )}
                >
                  <span className={cn('text-xs font-bold', fingering.rightMiddle ? 'text-amber-50' : 'text-amber-900')}>1</span>
                </div>

                {/* Bottom-left: Hole 4 (leftIndex) */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                    fingering.leftIndex
                      ? 'bg-amber-900 border-amber-900'
                      : 'bg-white border-amber-900',
                    isPlaying && 'ring-4 ring-amber-400'
                  )}
                >
                  <span className={cn('text-xs font-bold', fingering.leftIndex ? 'text-amber-50' : 'text-amber-900')}>4</span>
                </div>

                {/* Bottom-right: Hole 2 (rightIndex) */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center',
                    fingering.rightIndex
                      ? 'bg-amber-900 border-amber-900'
                      : 'bg-white border-amber-900',
                    isPlaying && 'ring-4 ring-amber-400'
                  )}
                >
                  <span className={cn('text-xs font-bold', fingering.rightIndex ? 'text-amber-50' : 'text-amber-900')}>2</span>
                </div>
              </div>

              <div className="text-xs text-amber-700">{note.duration}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
