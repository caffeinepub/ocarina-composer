import { Note, TimeSignature, NoteDuration, FingeringConfiguration } from '../types/music';
import { cn } from '../lib/utils';
import { Trash2 } from 'lucide-react';

interface SheetMusicProps {
  notes: Note[];
  timeSignature: TimeSignature;
  selectedNoteIndex: number | null;
  currentPlayingNoteIndex: number | null;
  fingeringConfig: FingeringConfiguration;
  onNoteSelect: (index: number) => void;
  onNoteDelete: (index: number) => void;
  onNoteDurationChange: (index: number, duration: NoteDuration) => void;
  onLyricsChange: (index: number, lyrics: string) => void;
}

const notePositions: Record<string, number> = {
  'C5': 60, 'C#5': 60, 'D5': 55, 'D#5': 55, 'E5': 50, 'F5': 45, 'F#5': 45,
  'G5': 40, 'G#5': 40, 'A5': 35, 'A#5': 35, 'B5': 30, 'C6': 25,
};

export function SheetMusic({
  notes,
  timeSignature,
  selectedNoteIndex,
  currentPlayingNoteIndex,
  fingeringConfig,
  onNoteSelect,
  onNoteDelete,
  onNoteDurationChange,
  onLyricsChange,
}: SheetMusicProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No notes yet. Start composing by clicking the piano keys below!</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-amber-900">Sheet Music</h3>
      
      {/* Staff header with clef and time signature */}
      <div className="mb-6 flex items-center gap-4">
        <div className="text-6xl text-amber-900">𝄞</div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-900">{timeSignature.numerator}</span>
          <span className="text-2xl font-bold text-amber-900">{timeSignature.denominator}</span>
        </div>
      </div>

      {/* Notes with vertical wrapping */}
      <div className="flex flex-wrap gap-8">
        {notes.map((note, index) => {
          const noteKey = `${note.name}${note.octave}`;
          const yPosition = notePositions[noteKey] || 50;
          const isSelected = selectedNoteIndex === index;
          const isPlaying = currentPlayingNoteIndex === index;
          
          return (
            <div
              key={note.id}
              className="flex flex-col items-center gap-2 min-w-[100px] cursor-pointer group"
              onClick={() => onNoteSelect(index)}
            >
              {/* Staff lines for this note */}
              <div className="relative w-20 h-24">
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  {[0, 1, 2, 3, 4].map((line) => (
                    <line
                      key={line}
                      x1="0"
                      y1={10 + line * 10}
                      x2="100%"
                      y2={10 + line * 10}
                      stroke="#78350f"
                      strokeWidth="1"
                    />
                  ))}
                </svg>

                {/* Note head and stem */}
                <div className="absolute" style={{ top: `${yPosition}px`, left: '50%', transform: 'translateX(-50%)' }}>
                  <svg width="40" height="60" className="overflow-visible">
                    {/* Stem */}
                    <line x1="30" y1="15" x2="30" y2="-25" stroke="#78350f" strokeWidth="2" />
                    
                    {/* Note head */}
                    <ellipse
                      cx="20"
                      cy="15"
                      rx="8"
                      ry="6"
                      fill={isPlaying ? '#f59e0b' : isSelected ? '#d97706' : '#78350f'}
                      stroke={isPlaying ? '#f59e0b' : isSelected ? '#d97706' : '#78350f'}
                      strokeWidth="2"
                      className="transition-colors"
                    />
                    
                    {/* Flag for eighth and sixteenth notes */}
                    {(note.duration === 'eighth' || note.duration === 'sixteenth') && (
                      <path
                        d="M 30 -25 Q 40 -20, 38 -10"
                        fill="none"
                        stroke="#78350f"
                        strokeWidth="2"
                      />
                    )}
                    {note.duration === 'sixteenth' && (
                      <path
                        d="M 30 -20 Q 40 -15, 38 -5"
                        fill="none"
                        stroke="#78350f"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                  
                  {/* Accidental */}
                  {note.name.includes('#') && (
                    <span className="absolute -left-4 top-2 text-lg font-bold text-amber-900">♯</span>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteDelete(index);
                  }}
                  className={cn(
                    "absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                    "bg-destructive text-destructive-foreground rounded-full p-1 z-10"
                  )}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Note info */}
              <div className="text-sm font-medium text-amber-900">
                {note.name}{note.octave}
              </div>
              
              <div className="text-xs text-amber-700">
                {note.duration}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
