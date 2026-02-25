import { useComposition } from '../hooks/useComposition';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { PianoKeyboard } from './PianoKeyboard';
import { SheetMusic } from './SheetMusic';
import { OcarinaIllustration } from './OcarinaIllustration';
import { OcarinaTablature } from './OcarinaTablature';
import { LyricsEditor } from './LyricsEditor';
import { PlaybackControls } from './PlaybackControls';
import { NoteDurationSelector } from './NoteDurationSelector';
import { SaveCompositionDialog } from './SaveCompositionDialog';
import { LoadCompositionDialog } from './LoadCompositionDialog';
import { OcarinaSettingsDialog } from './OcarinaSettingsDialog';
import { SongLibraryDialog } from './SongLibraryDialog';
import { GuidedPlaybackView } from './GuidedPlaybackView';
import { NoteDuration, PresetSong } from '../types/music';
import { useState } from 'react';
import { Button } from './ui/button';
import { Trash2, LogIn, LogOut, Loader2 } from 'lucide-react';

export function MusicEditor() {
  const {
    composition,
    selectedNoteIndex,
    currentPlayingNoteIndex,
    octaveRange,
    fingeringConfig,
    isAuthenticated,
    setSelectedNoteIndex,
    setCurrentPlayingNoteIndex,
    updateOctaveRange,
    updateFingeringForNote,
    resetFingeringToDefaults,
    addNote,
    deleteNote,
    modifyNoteDuration,
    setNoteLyrics,
    updateTitle,
    updateDescription,
    loadComposition,
    clearComposition,
  } = useComposition();

  const { login, clear, isLoggingIn, isInitializing } = useInternetIdentity();

  const [selectedDuration, setSelectedDuration] = useState<NoteDuration>('quarter');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Guided playback state
  const [guidedSong, setGuidedSong] = useState<PresetSong | null>(null);

  const { isPlaying, isPaused, play, pause, resume, stop } = useAudioPlayback(
    composition.notes,
    composition.tempo,
    setCurrentPlayingNoteIndex
  );

  const handlePlay = () => play(isRepeat);
  const handleToggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  const handleSelectSong = (song: PresetSong) => {
    // Stop any ongoing composition playback
    stop();
    setGuidedSong(song);
  };

  const handleExitGuidedPlayback = () => {
    setGuidedSong(null);
  };

  const displayNoteIndex = currentPlayingNoteIndex ?? selectedNoteIndex;
  const currentNote = displayNoteIndex !== null ? composition.notes[displayNoteIndex] : null;

  // ── Guided Playback Mode ──────────────────────────────────────────────────
  if (guidedSong) {
    return (
      <GuidedPlaybackView
        song={guidedSong}
        fingeringConfig={fingeringConfig}
        octaveRange={octaveRange}
        onExit={handleExitGuidedPlayback}
      />
    );
  }

  // ── Normal Composition Editor ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Title and toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={composition.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 w-full"
              placeholder="Composition Title"
            />
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
            {/* Song Library */}
            <SongLibraryDialog onSelectSong={handleSelectSong} />

            {/* Admin settings — only visible when authenticated */}
            {isAuthenticated ? (
              <>
                <OcarinaSettingsDialog
                  octaveRange={octaveRange}
                  fingeringConfig={fingeringConfig}
                  onOctaveRangeChange={updateOctaveRange}
                  onUpdateFingering={updateFingeringForNote}
                  onResetFingering={resetFingeringToDefaults}
                  isAuthenticated={isAuthenticated}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  title="Log out"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                title="Login to access admin settings"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4 mr-2" />
                )}
                {isLoggingIn ? 'Logging in…' : 'Login'}
              </Button>
            )}

            <Button onClick={clearComposition} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <textarea
          value={composition.description}
          onChange={(e) => updateDescription(e.target.value)}
          className="w-full text-sm bg-transparent border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Add a description for your composition..."
          rows={2}
        />
      </div>

      {/* Ocarina Illustration */}
      <div className="flex justify-center">
        <OcarinaIllustration
          note={currentNote}
          fingeringConfig={fingeringConfig}
          octaveRange={octaveRange}
        />
      </div>

      {/* Playback Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Playback</h3>
        <PlaybackControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          isRepeat={isRepeat}
          onPlay={handlePlay}
          onStop={stop}
          onPause={pause}
          onResume={resume}
          onToggleRepeat={handleToggleRepeat}
          onSave={() => setShowSaveDialog(true)}
          onLoad={() => setShowLoadDialog(true)}
          disabled={composition.notes.length === 0}
        />
      </div>

      {/* Piano Keyboard */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Piano Keyboard</h3>
        <div className="overflow-x-auto">
          <PianoKeyboard
            onNoteClick={(noteName, octave) => addNote(noteName, octave, selectedDuration)}
            disabled={isPlaying}
            octaveRange={octaveRange}
          />
        </div>
      </div>

      {/* Note Duration */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Note Duration</h3>
        <NoteDurationSelector
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
        />
      </div>

      {/* Ocarina Tablature */}
      <OcarinaTablature
        notes={composition.notes}
        currentPlayingNoteIndex={currentPlayingNoteIndex}
        fingeringConfig={fingeringConfig}
        octaveRange={octaveRange}
      />

      {/* Sheet Music */}
      <SheetMusic
        notes={composition.notes}
        timeSignature={composition.timeSignature}
        selectedNoteIndex={selectedNoteIndex}
        currentPlayingNoteIndex={currentPlayingNoteIndex}
        fingeringConfig={fingeringConfig}
        onNoteSelect={setSelectedNoteIndex}
        onNoteDelete={deleteNote}
        onNoteDurationChange={modifyNoteDuration}
        onLyricsChange={setNoteLyrics}
      />

      {/* Lyrics Editor */}
      <LyricsEditor
        notes={composition.notes}
        onLyricsChange={setNoteLyrics}
      />

      {/* Dialogs */}
      <SaveCompositionDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        composition={composition}
        onTitleChange={updateTitle}
        onDescriptionChange={updateDescription}
      />

      <LoadCompositionDialog
        open={showLoadDialog}
        onOpenChange={setShowLoadDialog}
        onLoad={loadComposition}
      />
    </div>
  );
}
