import { Button } from './ui/button';
import { Play, Square } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function PlaybackControls({ isPlaying, onPlay, onStop, disabled }: PlaybackControlsProps) {
  return (
    <div className="flex gap-3">
      {!isPlaying ? (
        <Button
          onClick={onPlay}
          disabled={disabled}
          size="lg"
          className="flex-1"
        >
          <Play className="h-5 w-5 mr-2" />
          Play
        </Button>
      ) : (
        <Button
          onClick={onStop}
          variant="destructive"
          size="lg"
          className="flex-1"
        >
          <Square className="h-5 w-5 mr-2" />
          Stop
        </Button>
      )}
    </div>
  );
}
