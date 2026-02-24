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
import { Loader2 } from 'lucide-react';
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
      await saveComposition.mutateAsync(composition);
      toast.success('Composition saved successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save composition');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Composition</DialogTitle>
          <DialogDescription>
            Save your ocarina composition to load it later.
          </DialogDescription>
        </DialogHeader>
        
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
          
          <div className="text-sm text-muted-foreground">
            Notes: {composition.notes.length}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveComposition.isPending}>
            {saveComposition.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
