import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OctaveRange, FingeringConfiguration, FingeringPattern } from '../types/music';
import { OCTAVE_RANGES } from '../utils/defaultFingeringPatterns';
import { FingeringConfigEditor } from './FingeringConfigEditor';

interface OcarinaSettingsDialogProps {
  octaveRange: OctaveRange;
  fingeringConfig: FingeringConfiguration;
  onOctaveRangeChange: (range: OctaveRange) => void;
  onUpdateFingering: (noteKey: string, fingering: FingeringPattern) => void;
  onResetFingering: () => void;
}

export function OcarinaSettingsDialog({
  octaveRange,
  fingeringConfig,
  onOctaveRangeChange,
  onUpdateFingering,
  onResetFingering,
}: OcarinaSettingsDialogProps) {
  const currentRangeLabel = OCTAVE_RANGES.find(
    (r) => r.start === octaveRange.start && r.end === octaveRange.end
  )?.label || `C${octaveRange.start} - C${octaveRange.end}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ocarina Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="octave" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="octave">Octave Range</TabsTrigger>
            <TabsTrigger value="fingering">Fingering Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="octave" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="octave-select">Select Octave Range</Label>
              <Select
                value={currentRangeLabel}
                onValueChange={(value) => {
                  const range = OCTAVE_RANGES.find((r) => r.label === value);
                  if (range) {
                    onOctaveRangeChange({ start: range.start, end: range.end });
                  }
                }}
              >
                <SelectTrigger id="octave-select">
                  <SelectValue placeholder="Select octave range" />
                </SelectTrigger>
                <SelectContent>
                  {OCTAVE_RANGES.map((range) => (
                    <SelectItem key={range.label} value={range.label}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                The piano keyboard and available notes will update to match your selection.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="fingering" className="pt-4">
            <FingeringConfigEditor
              octaveRange={octaveRange}
              fingeringConfig={fingeringConfig}
              onUpdateFingering={onUpdateFingering}
              onReset={onResetFingering}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
