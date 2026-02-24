import { useState } from 'react';
import { Composition } from '../types/music';
import { useListCompositions, useGetComposition } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Loader2, Music, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface LoadCompositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (composition: Composition) => void;
}

export function LoadCompositionDialog({
  open,
  onOpenChange,
  onLoad,
}: LoadCompositionDialogProps) {
  const { data: compositions, isLoading } = useListCompositions();
  const [selectedId, setSelectedId] = useState<bigint | null>(null);
  const [idInput, setIdInput] = useState('');
  const [idInputError, setIdInputError] = useState('');

  const { data: composition, isLoading: isLoadingComposition } = useGetComposition(selectedId);

  const handleSelectFromList = (id: bigint) => {
    setSelectedId(id);
    setIdInput('');
    setIdInputError('');
  };

  const handleIdInputChange = (value: string) => {
    setIdInput(value);
    setIdInputError('');
    if (value.trim() === '') {
      setSelectedId(null);
      return;
    }
    try {
      const parsed = BigInt(value.trim());
      setSelectedId(parsed);
    } catch {
      setIdInputError('Please enter a valid numeric ID');
      setSelectedId(null);
    }
  };

  const handleLoad = () => {
    if (composition) {
      onLoad(composition);
      toast.success('Composition loaded successfully!');
      onOpenChange(false);
      setSelectedId(null);
      setIdInput('');
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setIdInput('');
    setIdInputError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Load Composition</DialogTitle>
          <DialogDescription>
            Select a saved composition from the list, or enter its ID directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Load by ID */}
          <div className="space-y-1.5">
            <Label htmlFor="comp-id-input" className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              Load by ID
            </Label>
            <Input
              id="comp-id-input"
              value={idInput}
              onChange={(e) => handleIdInputChange(e.target.value)}
              placeholder="Enter composition ID (e.g. 0, 1, 2…)"
              className={idInputError ? 'border-destructive' : ''}
            />
            {idInputError && (
              <p className="text-xs text-destructive">{idInputError}</p>
            )}
          </div>

          {/* Saved compositions list */}
          <div className="space-y-1.5">
            <Label>Saved Compositions</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : compositions && compositions.length > 0 ? (
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-2">
                  {compositions.map(([id, comp]) => (
                    <Button
                      key={id.toString()}
                      variant={selectedId === id && idInput === '' ? 'default' : 'outline'}
                      className="w-full justify-start h-auto py-3"
                      onClick={() => handleSelectFromList(id)}
                    >
                      <Music className="h-4 w-4 mr-3 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-semibold truncate">{comp.title}</div>
                        {comp.description && (
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {comp.description}
                          </div>
                        )}
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground font-mono flex-shrink-0">
                        #{id.toString()}
                      </span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <Music className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No saved compositions yet.</p>
                <p className="text-xs mt-1">Create and save your first composition!</p>
              </div>
            )}
          </div>
        </div>

        {selectedId !== null && !idInputError && (
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => { setSelectedId(null); setIdInput(''); }} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleLoad}
              disabled={isLoadingComposition || !composition}
              className="flex-1"
            >
              {isLoadingComposition && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Load Composition
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
