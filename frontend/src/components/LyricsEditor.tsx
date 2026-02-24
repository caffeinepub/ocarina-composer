import { Note } from '../types/music';
import { Input } from './ui/input';

interface LyricsEditorProps {
  notes: Note[];
  onLyricsChange: (index: number, lyrics: string) => void;
}

export function LyricsEditor({ notes, onLyricsChange }: LyricsEditorProps) {
  if (notes.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Lyrics</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {notes.map((note, index) => (
          <div key={note.id} className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="text-xs text-muted-foreground">
              {note.name}{note.octave}
            </div>
            <Input
              type="text"
              value={note.lyrics || ''}
              onChange={(e) => onLyricsChange(index, e.target.value)}
              placeholder="lyric"
              className="w-24 text-center text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
