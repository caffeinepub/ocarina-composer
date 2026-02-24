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
import { ScrollArea } from './ui/scroll-area';
import { Loader2, Music } from 'lucide-react';
import { useState } from 'react';
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
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const { data: composition, isLoading: isLoadingComposition } = useGetComposition(selectedTitle || '');

  const handleLoad = () => {
    if (composition) {
      onLoad(composition);
      toast.success('Composition loaded successfully!');
      onOpenChange(false);
      setSelectedTitle(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Load Composition</DialogTitle>
          <DialogDescription>
            Select a saved composition to load.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : compositions && compositions.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {compositions.map((title) => (
                <Button
                  key={title}
                  variant={selectedTitle === title ? 'default' : 'outline'}
                  className="w-full justify-start h-auto py-4"
                  onClick={() => setSelectedTitle(title)}
                >
                  <Music className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">{title}</div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No saved compositions yet.</p>
            <p className="text-sm mt-1">Create and save your first composition!</p>
          </div>
        )}
        
        {selectedTitle && (
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setSelectedTitle(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleLoad} disabled={isLoadingComposition} className="flex-1">
              {isLoadingComposition && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Load
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
