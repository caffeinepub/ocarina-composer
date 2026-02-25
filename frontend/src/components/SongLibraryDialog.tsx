import { useState } from 'react';
import { Music2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { PresetSong, SongCategory } from '../types/music';
import { SONGS_BY_CATEGORY, CATEGORY_ICONS } from '../data/presetSongs';

interface SongLibraryDialogProps {
  onSelectSong: (song: PresetSong) => void;
}

const CATEGORY_COLORS: Record<SongCategory, string> = {
  'Classic Folk': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Video Games': 'bg-violet-100 text-violet-800 border-violet-200',
  'Mixed Genres': 'bg-rose-100 text-rose-800 border-rose-200',
};

export function SongLibraryDialog({ onSelectSong }: SongLibraryDialogProps) {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<SongCategory>>(
    new Set(['Classic Folk', 'Video Games', 'Mixed Genres'])
  );

  const toggleCategory = (category: SongCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleSelectSong = (song: PresetSong) => {
    onSelectSong(song);
    setOpen(false);
  };

  const categories = Object.keys(SONGS_BY_CATEGORY) as SongCategory[];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Music2 className="h-4 w-4" />
          Song Library
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Music2 className="h-5 w-5 text-primary" />
            Song Library
          </DialogTitle>
          <DialogDescription>
            Choose a preset song to play step-by-step with guided fingering.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[420px] pr-3">
          <div className="space-y-3">
            {categories.map((category) => {
              const songs = SONGS_BY_CATEGORY[category];
              const isExpanded = expandedCategories.has(category);
              return (
                <div key={category} className="border border-border rounded-lg overflow-hidden">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                      <span className="font-semibold text-sm">{category}</span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {songs.length}
                      </Badge>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Song list */}
                  {isExpanded && (
                    <div className="divide-y divide-border">
                      {songs.map((song) => (
                        <button
                          key={song.id}
                          onClick={() => handleSelectSong(song)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors text-left group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {song.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {song.notes.length} notes · {song.tempo} BPM
                            </p>
                          </div>
                          <span
                            className={`ml-3 text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${CATEGORY_COLORS[category]}`}
                          >
                            {CATEGORY_ICONS[category]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
