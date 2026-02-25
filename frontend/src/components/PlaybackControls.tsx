import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Play, Square, Pause, RotateCcw, Save, FolderOpen } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isRepeat: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onToggleRepeat: () => void;
  onSave: () => void;
  onLoad: () => void;
  disabled?: boolean;
}

export function PlaybackControls({
  isPlaying,
  isPaused,
  isRepeat,
  onPlay,
  onStop,
  onPause,
  onResume,
  onToggleRepeat,
  onSave,
  onLoad,
  disabled,
}: PlaybackControlsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Play / Stop */}
        {!isPlaying ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPlay}
                disabled={disabled}
                size="lg"
                className="min-w-[100px]"
              >
                <Play className="h-5 w-5 mr-2" />
                Play
              </Button>
            </TooltipTrigger>
            <TooltipContent>Play composition</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onStop}
                variant="destructive"
                size="lg"
                className="min-w-[100px]"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop playback</TooltipContent>
          </Tooltip>
        )}

        {/* Pause / Resume */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={isPaused ? onResume : onPause}
              variant="outline"
              size="lg"
              disabled={!isPlaying && !isPaused}
              className={isPaused ? 'border-primary text-primary' : ''}
            >
              <Pause className="h-5 w-5 mr-2" />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isPaused ? 'Resume playback' : 'Pause playback'}</TooltipContent>
        </Tooltip>

        {/* Repeat toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onToggleRepeat}
              variant={isRepeat ? 'default' : 'outline'}
              size="lg"
              title={isRepeat ? 'Repeat on' : 'Repeat off'}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Repeat
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRepeat ? 'Repeat is ON — click to turn off' : 'Repeat is OFF — click to turn on'}</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1 hidden sm:block" />

        {/* Save */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              variant="outline"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save composition</TooltipContent>
        </Tooltip>

        {/* Load */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLoad}
              variant="outline"
              size="lg"
            >
              <FolderOpen className="h-5 w-5 mr-2" />
              Load
            </Button>
          </TooltipTrigger>
          <TooltipContent>Load composition</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
