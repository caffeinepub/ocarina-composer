import { useEffect, useRef } from 'react';
import { Note, FingeringConfiguration } from '../types/music';
import { getNoteFingerPattern } from '../utils/ocarinaNoteMapper';

interface NoteSequenceGuideProps {
  notes: Note[];
  currentStep: number;
  fingeringConfig: FingeringConfiguration;
  baseOctave: number;
}

function MiniHoleDiagram({
  note,
  fingeringConfig,
  baseOctave,
}: {
  note: Note;
  fingeringConfig: FingeringConfiguration;
  baseOctave: number;
}) {
  const pattern = getNoteFingerPattern(note.name, note.octave, fingeringConfig, baseOctave);
  const holes = [
    { key: 'leftMiddle' as const, label: '3' },
    { key: 'rightMiddle' as const, label: '1' },
    { key: 'rightIndex' as const, label: '2' },
    { key: 'leftIndex' as const, label: '4' },
  ];

  return (
    <div className="grid grid-cols-2 gap-0.5 w-8 h-8 flex-shrink-0">
      {holes.map(({ key, label }) => (
        <div
          key={key}
          title={`Hole ${label}: ${pattern[key] ? 'closed' : 'open'}`}
          className={`rounded-full w-3 h-3 border transition-colors ${
            pattern[key]
              ? 'bg-foreground border-foreground'
              : 'bg-background border-border'
          }`}
        />
      ))}
    </div>
  );
}

export function NoteSequenceGuide({
  notes,
  currentStep,
  fingeringConfig,
  baseOctave,
}: NoteSequenceGuideProps) {
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStep]);

  if (notes.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h4 className="text-sm font-semibold">Note Sequence</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Step {currentStep + 1} of {notes.length}
        </p>
      </div>

      <div className="overflow-y-auto max-h-48">
        <div className="p-2 space-y-1">
          {notes.map((note, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={`${note.id}-${index}`}
                ref={isActive ? activeRef : null}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : isCompleted
                    ? 'opacity-40'
                    : 'hover:bg-muted/50'
                }`}
              >
                {/* Step number */}
                <span
                  className={`text-xs font-mono w-6 text-right flex-shrink-0 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </span>

                {/* Note name */}
                <span
                  className={`text-sm font-bold w-8 flex-shrink-0 ${
                    isActive ? 'text-primary-foreground' : ''
                  }`}
                >
                  {note.name}
                  <sub className={`text-xs font-normal ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {note.octave}
                  </sub>
                </span>

                {/* Duration badge */}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {note.duration.charAt(0).toUpperCase()}
                </span>

                {/* Mini hole diagram */}
                <div className={`ml-auto ${isActive ? 'opacity-90' : isCompleted ? 'opacity-40' : ''}`}>
                  <MiniHoleDiagram
                    note={note}
                    fingeringConfig={fingeringConfig}
                    baseOctave={baseOctave}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
