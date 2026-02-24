import { NoteName, FingeringPattern, FingeringConfiguration, OctaveRange } from '../types/music';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface FingeringConfigEditorProps {
  octaveRange: OctaveRange;
  fingeringConfig: FingeringConfiguration;
  onUpdateFingering: (noteKey: string, fingering: FingeringPattern) => void;
  onReset: () => void;
}

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const holeLabels = ['Left Index (4)', 'Left Middle (3)', 'Right Index (2)', 'Right Middle (1)'];
const holeKeys: (keyof FingeringPattern)[] = ['leftIndex', 'leftMiddle', 'rightIndex', 'rightMiddle'];

export function FingeringConfigEditor({
  octaveRange,
  fingeringConfig,
  onUpdateFingering,
  onReset,
}: FingeringConfigEditorProps) {
  // Generate all notes in the octave range
  const allNotes: string[] = [];
  for (let octave = octaveRange.start; octave <= octaveRange.end; octave++) {
    chromaticNotes.forEach((note) => {
      allNotes.push(`${note}${octave}`);
    });
  }

  const toggleHole = (noteKey: string, holeKey: keyof FingeringPattern) => {
    const currentFingering = fingeringConfig[noteKey] || { 
      leftIndex: false, 
      leftMiddle: false, 
      rightIndex: false, 
      rightMiddle: false 
    };
    const newFingering: FingeringPattern = {
      ...currentFingering,
      [holeKey]: !currentFingering[holeKey]
    };
    onUpdateFingering(noteKey, newFingering);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Fingering Configuration</h4>
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
                {holeLabels.map((label, index) => (
                  <th key={index} className="text-center p-2 font-semibold text-xs">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allNotes.map((noteKey) => {
                const fingering = fingeringConfig[noteKey] || { 
                  leftIndex: false, 
                  leftMiddle: false, 
                  rightIndex: false, 
                  rightMiddle: false 
                };
                
                return (
                  <tr key={noteKey} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium text-sm">{noteKey}</td>
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
        Checked = Hole closed | Unchecked = Hole open
      </p>
    </div>
  );
}
