import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Settings, Globe, RotateCcw, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OctaveRange, FingeringConfiguration, FingeringPattern } from '../types/music';
import { OCTAVE_RANGES } from '../utils/defaultFingeringPatterns';
import { FingeringConfigEditor } from './FingeringConfigEditor';
import { useSetFingeringDefaults, useResetFingeringDefaults, fingeringConfigToBackendConfig } from '../hooks/useQueries';
import { toast } from 'sonner';

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
  // Find the matching range option by base octave (start)
  const currentRange = OCTAVE_RANGES.find((r) => r.start === octaveRange.start);
  const currentRangeLabel = currentRange?.label ?? `C${octaveRange.start} - C${octaveRange.end}`;

  const setFingeringDefaults = useSetFingeringDefaults();
  const resetFingeringDefaults = useResetFingeringDefaults();

  const handleSetGlobalDefault = async () => {
    try {
      const backendConfig = fingeringConfigToBackendConfig(fingeringConfig, 'Custom', 'Alto C Ocarina');
      await setFingeringDefaults.mutateAsync(backendConfig);
      toast.success('Global fingering defaults saved!');
    } catch {
      toast.error('Failed to save global defaults');
    }
  };

  const handleResetFactory = async () => {
    try {
      await resetFingeringDefaults.mutateAsync();
      onResetFingering();
      toast.success('Fingering reset to factory defaults!');
    } catch {
      toast.error('Failed to reset factory defaults');
    }
  };

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

          <TabsContent value="octave" className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label htmlFor="octave-select" className="text-sm font-semibold">
                Ocarina Octave Range
              </Label>
              <Select
                value={currentRangeLabel}
                onValueChange={(value) => {
                  const range = OCTAVE_RANGES.find((r) => r.label === value);
                  if (range) {
                    onOctaveRangeChange({ start: range.start, end: range.start + 1 });
                  }
                }}
              >
                <SelectTrigger id="octave-select" className="w-full">
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
                Choose the octave your ocarina plays in. A standard alto C ocarina plays{' '}
                <strong>C5–C6</strong>. Soprano ocarinas may play <strong>C6–C7</strong>, while
                bass ocarinas play <strong>C3–C4</strong> or <strong>C4–C5</strong>.
              </p>
            </div>

            {/* Visual preview of the selected range */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Selected Range Preview
              </p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const base = octaveRange.start;
                  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
                  const allNotes = [
                    ...notes.map((n) => `${n}${base}`),
                    `C${base + 1}`,
                  ];
                  return allNotes.map((n) => (
                    <span
                      key={n}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {n}
                    </span>
                  ));
                })()}
              </div>
              <p className="text-xs text-muted-foreground">
                13 notes total — the piano keyboard will highlight this range in amber.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="fingering" className="pt-4 space-y-4">
            <FingeringConfigEditor
              octaveRange={octaveRange}
              fingeringConfig={fingeringConfig}
              onUpdateFingering={onUpdateFingering}
              onReset={onResetFingering}
            />

            {/* Global defaults actions */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Global Defaults</p>
              <p className="text-xs text-muted-foreground">
                Save the current fingering configuration as the global default for all users, or
                restore the original factory settings.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSetGlobalDefault}
                  disabled={setFingeringDefaults.isPending || resetFingeringDefaults.isPending}
                >
                  {setFingeringDefaults.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  Set as Global Default
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFactory}
                  disabled={setFingeringDefaults.isPending || resetFingeringDefaults.isPending}
                >
                  {resetFingeringDefaults.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-2" />
                  )}
                  Reset to Factory Defaults
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
