import { useComposition } from '../hooks/useComposition';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
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
import { NoteDuration } from '../types/music';
import { useState } from 'react';
import { Button } from './ui/button';
import { Save, FolderOpen, Trash2 } from 'lucide-react';

export function MusicEditor() {
  const {
    composition,
    selectedNoteIndex,
    currentPlayingNoteIndex,
    octaveRange,
    fingeringConfig,
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

  const [selectedDuration, setSelectedDuration] = useState<NoteDuration>('quarter');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const { isPlaying, play, stop } = useAudioPlayback(
    composition.notes,
    composition.tempo,
    setCurrentPlayingNoteIndex
  );

  const displayNoteIndex = currentPlayingNoteIndex ?? selectedNoteIndex;
  const currentNote = displayNoteIndex !== null ? composition.notes[displayNoteIndex] : null;

  return (
    <div className="space-y-6">
      {/* Title and Description Section */}
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
          <div className="flex gap-2 flex-shrink-0">
            <OcarinaSettingsDialog
              octaveRange={octaveRange}
              fingeringConfig={fingeringConfig}
              onOctaveRangeChange={updateOctaveRange}
              onUpdateFingering={updateFingeringForNote}
              onResetFingering={resetFingeringToDefaults}
            />
            <Button onClick={() => setShowLoadDialog(true)} variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button onClick={() => setShowSaveDialog(true)} variant="default" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={clearComposition} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Description Editor */}
        <div>
          <textarea
            value={composition.description}
            onChange={(e) => updateDescription(e.target.value)}
            className="w-full text-sm bg-transparent border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Add a description for your composition..."
            rows={2}
          />
        </div>
      </div>

      {/* 1. Ocarina Illustration (Top) */}
      <div className="flex justify-center">
        <OcarinaIllustration note={currentNote} fingeringConfig={fingeringConfig} />
      </div>

      {/* 2. Playback Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Playback</h3>
        <PlaybackControls
          isPlaying={isPlaying}
          onPlay={play}
          onStop={stop}
          disabled={composition.notes.length === 0}
        />
      </div>

      {/* 3. Piano Keyboard */}
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

      {/* Note Duration Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Note Duration</h3>
        <NoteDurationSelector
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
        />
      </div>

      {/* 4. Ocarina Tablature */}
      <OcarinaTablature 
        notes={composition.notes} 
        currentPlayingNoteIndex={currentPlayingNoteIndex}
        fingeringConfig={fingeringConfig}
      />

      {/* 5. Sheet Music */}
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

      {/* 6. Lyrics (Bottom) */}
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
