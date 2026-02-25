import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';

interface FingeringConfigEditorProps {
  fingeringConfig: FingeringConfiguration;
  onUpdateFingering: (noteKey: string, fingering: FingeringPattern) => void;
  onReset: () => void;
}

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** All 13 relative note keys in ascending order */
const ALL_RELATIVE_KEYS: string[] = [...chromaticNotes, 'C_upper'];

const holeLabels = ['Left Index (4)', 'Left Middle (3)', 'Right Index (2)', 'Right Middle (1)'];
const holeKeys: (keyof FingeringPattern)[] = ['leftIndex', 'leftMiddle', 'rightIndex', 'rightMiddle'];

function getDisplayLabel(key: string): string {
  if (key === 'C_upper') return 'C (upper)';
  return key;
}

export function FingeringConfigEditor({
  fingeringConfig,
  onUpdateFingering,
  onReset,
}: FingeringConfigEditorProps) {
  const toggleHole = (noteKey: string, holeKey: keyof FingeringPattern) => {
    const current = fingeringConfig[noteKey] ?? {
      leftIndex: false,
      leftMiddle: false,
      rightIndex: false,
      rightMiddle: false,
    };
    onUpdateFingering(noteKey, { ...current, [holeKey]: !current[holeKey] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Fingering Configuration</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            13 notes (C through C upper) — applies to <strong>all octaves</strong>
          </p>
        </div>
        <Button onClick={onReset} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold text-sm">Note</th>
                {holeLabels.map((label, i) => (
                  <th key={i} className="text-center p-2 font-semibold text-xs">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_RELATIVE_KEYS.map((noteKey, noteIndex) => {
                const fingering = fingeringConfig[noteKey] ?? {
                  leftIndex: false,
                  leftMiddle: false,
                  rightIndex: false,
                  rightMiddle: false,
                };
                const isRoot = noteIndex === 0;
                const isTop  = noteIndex === ALL_RELATIVE_KEYS.length - 1;

                return (
                  <tr
                    key={noteKey}
                    className={cn(
                      'border-b hover:bg-muted/50',
                      (isRoot || isTop) && 'bg-primary/5'
                    )}
                  >
                    <td className="p-2 font-medium text-sm">
                      {getDisplayLabel(noteKey)}
                      {isRoot && (
                        <span className="ml-1 text-[10px] text-primary font-normal">(root)</span>
                      )}
                      {isTop && (
                        <span className="ml-1 text-[10px] text-primary font-normal">(top)</span>
                      )}
                    </td>
                    {holeKeys.map((holeKey) => (
                      <td key={holeKey} className="text-center p-2">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={fingering[holeKey]}
                            onCheckedChange={() => toggleHole(noteKey, holeKey)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        Checked = Hole closed &nbsp;|&nbsp; Unchecked = Hole open
      </p>
    </div>
  );
}
