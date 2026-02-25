import { Play, Pause, Square, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { OcarinaIllustration } from './OcarinaIllustration';
import { NoteSequenceGuide } from './NoteSequenceGuide';
import { useGuidedPlayback } from '../hooks/useGuidedPlayback';
import { PresetSong, FingeringConfiguration, OctaveRange } from '../types/music';
import { CATEGORY_ICONS } from '../data/presetSongs';

interface GuidedPlaybackViewProps {
  song: PresetSong;
  fingeringConfig: FingeringConfiguration;
  octaveRange: OctaveRange;
  onExit: () => void;
}

export function GuidedPlaybackView({
  song,
  fingeringConfig,
  octaveRange,
  onExit,
}: GuidedPlaybackViewProps) {
  const {
    currentStep,
    totalSteps,
    currentNote,
    playbackState,
    play,
    pause,
    stop,
    nextStep,
    previousStep,
  } = useGuidedPlayback(song);

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isStopped = playbackState === 'stopped';

  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" onClick={onExit} className="gap-1 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">{CATEGORY_ICONS[song.category]}</span>
            <h2 className="text-2xl font-bold truncate">{song.title}</h2>
            <Badge variant="secondary" className="flex-shrink-0">
              {song.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {song.tempo} BPM · {totalSteps} notes
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {isStopped ? 1 : currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${isStopped ? (1 / totalSteps) * 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current note display */}
      <div className="bg-card border border-border rounded-lg p-4 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Note</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-primary">
            {currentNote?.name ?? '—'}
          </span>
          {currentNote && (
            <span className="text-2xl text-muted-foreground font-medium">
              {currentNote.octave}
            </span>
          )}
        </div>
        {currentNote && (
          <p className="text-sm text-muted-foreground mt-1 capitalize">
            {currentNote.duration} note
          </p>
        )}
      </div>

      {/* Ocarina illustration */}
      <div className="flex justify-center">
        <OcarinaIllustration
          note={currentNote}
          fingeringConfig={fingeringConfig}
          octaveRange={octaveRange}
        />
      </div>

      {/* Playback controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Previous step */}
          <Button
            variant="outline"
            size="icon"
            onClick={previousStep}
            disabled={currentStep === 0 && isStopped}
            title="Previous step"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* Stop */}
          <Button
            variant="outline"
            size="icon"
            onClick={stop}
            disabled={isStopped}
            title="Stop"
          >
            <Square className="h-4 w-4" />
          </Button>

          {/* Play / Pause */}
          {isPlaying ? (
            <Button
              size="lg"
              onClick={pause}
              className="gap-2 px-6"
              title="Pause"
            >
              <Pause className="h-5 w-5" />
              Pause
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={play}
              className="gap-2 px-6"
              title={isPaused ? 'Resume' : 'Play'}
            >
              <Play className="h-5 w-5" />
              {isPaused ? 'Resume' : 'Play'}
            </Button>
          )}

          {/* Next step */}
          <Button
            variant="outline"
            size="icon"
            onClick={nextStep}
            disabled={currentStep >= totalSteps - 1}
            title="Next step"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Use ← → buttons to step through notes manually, or press Play for auto-advance
        </p>
      </div>

      {/* Note sequence guide */}
      <NoteSequenceGuide
        notes={song.notes}
        currentStep={currentStep}
        fingeringConfig={fingeringConfig}
        baseOctave={octaveRange.start}
      />
    </div>
  );
}
