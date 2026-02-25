import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Settings, Save, RotateCcw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OctaveRange, FingeringConfiguration, FingeringPattern } from '../types/music';
import { OCTAVE_RANGES } from '../utils/defaultFingeringPatterns';
import { FingeringConfigEditor } from './FingeringConfigEditor';
import {
  useSetFingeringDefaults,
  useResetFingeringDefaults,
  fingeringConfigToBackendConfig,
} from '../hooks/useQueries';

interface OcarinaSettingsDialogProps {
  octaveRange: OctaveRange;
  fingeringConfig: FingeringConfiguration;
  onOctaveRangeChange: (range: OctaveRange) => void;
  onUpdateFingering: (noteKey: string, fingering: FingeringPattern) => void;
  onResetFingering: () => void;
  isAuthenticated: boolean;
}

export function OcarinaSettingsDialog({
  octaveRange,
  fingeringConfig,
  onOctaveRangeChange,
  onUpdateFingering,
  onResetFingering,
  isAuthenticated,
}: OcarinaSettingsDialogProps) {
  // Only render the dialog trigger and content when the user is authenticated
  if (!isAuthenticated) return null;

  return <AuthenticatedSettingsDialog
    octaveRange={octaveRange}
    fingeringConfig={fingeringConfig}
    onOctaveRangeChange={onOctaveRangeChange}
    onUpdateFingering={onUpdateFingering}
    onResetFingering={onResetFingering}
  />;
}

// Inner component — only rendered when authenticated, so hooks are always called
function AuthenticatedSettingsDialog({
  octaveRange,
  fingeringConfig,
  onOctaveRangeChange,
  onUpdateFingering,
  onResetFingering,
}: Omit<OcarinaSettingsDialogProps, 'isAuthenticated'>) {
  const currentRange = OCTAVE_RANGES.find((r) => r.start === octaveRange.start);
  const currentRangeLabel = currentRange?.label ?? `C${octaveRange.start} - C${octaveRange.end}`;

  const setFingeringDefaults = useSetFingeringDefaults(true);
  const resetFingeringDefaults = useResetFingeringDefaults(true);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveMyConfig = async () => {
    setSaveStatus('idle');
    try {
      const backendConfig = fingeringConfigToBackendConfig(fingeringConfig, 'Custom', 'Alto C Ocarina');
      await setFingeringDefaults.mutateAsync(backendConfig);
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    }
  };

  const handleResetMyConfig = async () => {
    setResetStatus('idle');
    try {
      await resetFingeringDefaults.mutateAsync();
      onResetFingering();
      setResetStatus('success');
    } catch {
      setResetStatus('error');
    }
  };

  return (
    <Dialog onOpenChange={() => { setSaveStatus('idle'); setResetStatus('idle'); }}>
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

          {/* ── Octave Range Tab ── */}
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

            {/* Range preview */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Selected Range Preview
              </p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const base = octaveRange.start;
                  const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
                  const allNotes = [
                    ...noteNames.map((n) => `${n}${base}`),
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
                13 notes total — the piano keyboard highlights this range in amber.
                The fingering configuration applies to <strong>all octaves</strong>.
              </p>
            </div>
          </TabsContent>

          {/* ── Fingering Configuration Tab ── */}
          <TabsContent value="fingering" className="pt-4 space-y-4">
            <FingeringConfigEditor
              fingeringConfig={fingeringConfig}
              onUpdateFingering={onUpdateFingering}
              onReset={onResetFingering}
            />

            {/* Admin config actions */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-foreground">My Fingering Config</p>
              <p className="text-xs text-muted-foreground">
                Save your fingering configuration or reset it back to the factory defaults.
                This configuration is private to you and applies to all octaves.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveMyConfig}
                  disabled={setFingeringDefaults.isPending || resetFingeringDefaults.isPending}
                >
                  {setFingeringDefaults.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Fingering Config
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetMyConfig}
                  disabled={setFingeringDefaults.isPending || resetFingeringDefaults.isPending}
                >
                  {resetFingeringDefaults.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-2" />
                  )}
                  Reset to Defaults
                </Button>
              </div>

              {/* Inline save feedback */}
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  Your fingering configuration has been saved.
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Failed to save your fingering configuration. Make sure you are logged in as admin.
                </div>
              )}

              {/* Inline reset feedback */}
              {resetStatus === 'success' && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  Your fingering configuration has been reset to defaults.
                </div>
              )}
              {resetStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Failed to reset your fingering configuration. Make sure you are logged in as admin.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
