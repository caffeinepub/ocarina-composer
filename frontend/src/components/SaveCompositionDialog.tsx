import { useState } from 'react';
import { Composition } from '../types/music';
import { useSaveComposition } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader2, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SaveCompositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  composition: Composition;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function SaveCompositionDialog({
  open,
  onOpenChange,
  composition,
  onTitleChange,
  onDescriptionChange,
}: SaveCompositionDialogProps) {
  const saveComposition = useSaveComposition();
  const [savedId, setSavedId] = useState<bigint | null>(null);

  const handleSave = async () => {
    if (!composition.title.trim()) {
      toast.error('Please enter a title for your composition');
      return;
    }

    if (composition.notes.length === 0) {
      toast.error('Cannot save an empty composition');
      return;
    }

    try {
      const id = await saveComposition.mutateAsync(composition);
      setSavedId(id);
      toast.success('Composition saved successfully!');
    } catch (error) {
      toast.error('Failed to save composition');
      console.error(error);
    }
  };

  const handleClose = () => {
    setSavedId(null);
    onOpenChange(false);
  };

  const handleCopyId = () => {
    if (savedId !== null) {
      navigator.clipboard.writeText(savedId.toString()).then(() => {
        toast.success('Composition ID copied to clipboard!');
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Composition</DialogTitle>
          <DialogDescription>
            Save your ocarina composition to load it later. No account required.
          </DialogDescription>
        </DialogHeader>

        {savedId !== null ? (
          /* Success state: show the composition ID */
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Composition saved!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep your composition ID to load it later.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Composition ID</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-sm bg-muted rounded px-3 py-2 border border-border select-all">
                  {savedId.toString()}
                </div>
                <Button variant="outline" size="icon" onClick={handleCopyId} title="Copy ID">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this ID in the Load dialog to retrieve your composition.
              </p>
            </div>
          </div>
        ) : (
          /* Default state: form */
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={composition.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="My Ocarina Song"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={composition.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="A beautiful melody for the 4-hole ocarina..."
                rows={4}
              />
            </div>

            <div className="text-sm text-muted-foreground">Notes: {composition.notes.length}</div>
          </div>
        )}

        <DialogFooter>
          {savedId !== null ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveComposition.isPending}>
                {saveComposition.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
