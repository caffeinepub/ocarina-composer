import { useState, useCallback, useEffect } from 'react';
import { Composition, Note, NoteDuration, NoteName, FingeringConfiguration, FingeringPattern, OctaveRange } from '../types/music';
import { getDefaultFingeringPatterns } from '../utils/defaultFingeringPatterns';

export function useComposition() {
  const [composition, setComposition] = useState<Composition>({
    title: 'Untitled',
    description: '',
    notes: [],
    timeSignature: { numerator: 4, denominator: 4 },
    tempo: 120,
  });

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [currentPlayingNoteIndex, setCurrentPlayingNoteIndex] = useState<number | null>(null);
  
  // Octave range state (default C5-C6)
  const [octaveRange, setOctaveRange] = useState<OctaveRange>({ start: 5, end: 6 });
  
  // Fingering configuration state - includes one extra C note from next octave
  const [fingeringConfig, setFingeringConfig] = useState<FingeringConfiguration>(() => 
    getDefaultFingeringPatterns(5, 6)
  );

  // Update fingering configuration when octave range changes
  useEffect(() => {
    setFingeringConfig(getDefaultFingeringPatterns(octaveRange.start, octaveRange.end));
  }, [octaveRange]);

  const updateOctaveRange = useCallback((newRange: OctaveRange) => {
    setOctaveRange(newRange);
  }, []);

  const updateFingeringForNote = useCallback((noteKey: string, fingering: FingeringPattern) => {
    setFingeringConfig(prev => ({
      ...prev,
      [noteKey]: fingering,
    }));
  }, []);

  const resetFingeringToDefaults = useCallback(() => {
    setFingeringConfig(getDefaultFingeringPatterns(octaveRange.start, octaveRange.end));
  }, [octaveRange]);

  const addNote = useCallback((noteName: NoteName, octave: number, duration: NoteDuration) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random()}`,
      name: noteName,
      octave,
      duration,
    };
    
    setComposition(prev => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
    
    setSelectedNoteIndex(composition.notes.length);
  }, [composition.notes.length]);

  const deleteNote = useCallback((index: number) => {
    setComposition(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
    
    if (selectedNoteIndex === index) {
      setSelectedNoteIndex(null);
    }
  }, [selectedNoteIndex]);

  const modifyNoteDuration = useCallback((index: number, duration: NoteDuration) => {
    setComposition(prev => ({
      ...prev,
      notes: prev.notes.map((note, i) => 
        i === index ? { ...note, duration } : note
      ),
    }));
  }, []);

  const modifyNotePitch = useCallback((index: number, noteName: NoteName, octave: number) => {
    setComposition(prev => ({
      ...prev,
      notes: prev.notes.map((note, i) => 
        i === index ? { ...note, name: noteName, octave } : note
      ),
    }));
  }, []);

  const setNoteLyrics = useCallback((index: number, lyrics: string) => {
    setComposition(prev => ({
      ...prev,
      notes: prev.notes.map((note, i) => 
        i === index ? { ...note, lyrics } : note
      ),
    }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setComposition(prev => ({ ...prev, title }));
  }, []);

  const updateDescription = useCallback((description: string) => {
    setComposition(prev => ({ ...prev, description }));
  }, []);

  const loadComposition = useCallback((newComposition: Composition) => {
    setComposition(newComposition);
    setSelectedNoteIndex(null);
    setCurrentPlayingNoteIndex(null);
  }, []);

  const clearComposition = useCallback(() => {
    setComposition({
      title: 'Untitled',
      description: '',
      notes: [],
      timeSignature: { numerator: 4, denominator: 4 },
      tempo: 120,
    });
    setSelectedNoteIndex(null);
    setCurrentPlayingNoteIndex(null);
  }, []);

  return {
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
    modifyNotePitch,
    setNoteLyrics,
    updateTitle,
    updateDescription,
    loadComposition,
    clearComposition,
  };
}
