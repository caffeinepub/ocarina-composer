import { useState, useCallback, useEffect } from 'react';
import {
  Composition,
  Note,
  NoteDuration,
  NoteName,
  FingeringConfiguration,
  FingeringPattern,
  OctaveRange,
} from '../types/music';
import { getDefaultFingeringPatterns } from '../utils/defaultFingeringPatterns';
import { useGetFingeringDefaults, backendConfigToFingeringConfig } from './useQueries';

// Default ocarina range: C5-C6
const DEFAULT_BASE_OCTAVE = 5;

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

  // Octave range state — start is the base octave, end = start + 1
  const [octaveRange, setOctaveRange] = useState<OctaveRange>({
    start: DEFAULT_BASE_OCTAVE,
    end: DEFAULT_BASE_OCTAVE + 1,
  });

  // Fingering configuration state — 13 notes: C{start} through C{start+1}
  const [fingeringConfig, setFingeringConfig] = useState<FingeringConfiguration>(() =>
    getDefaultFingeringPatterns(DEFAULT_BASE_OCTAVE)
  );

  // Track whether we've seeded from backend defaults yet
  const [seededFromBackend, setSeededFromBackend] = useState(false);

  // Fetch global fingering defaults from backend
  const { data: backendDefaults } = useGetFingeringDefaults();

  // Seed fingering config from backend global defaults on first load
  useEffect(() => {
    if (!seededFromBackend && backendDefaults && backendDefaults.fingerings.length > 0) {
      const converted = backendConfigToFingeringConfig(backendDefaults);
      // Only seed if the backend has entries for the current octave range
      const hasRelevantNotes = Object.keys(converted).some((key) => {
        const octaveNum = parseInt(key.replace(/[^0-9]/g, ''), 10);
        return octaveNum >= octaveRange.start && octaveNum <= octaveRange.end;
      });
      if (hasRelevantNotes) {
        setFingeringConfig((prev) => ({ ...prev, ...converted }));
      }
      setSeededFromBackend(true);
    }
  }, [backendDefaults, seededFromBackend, octaveRange]);

  // Update fingering configuration when octave range changes
  useEffect(() => {
    const localDefaults = getDefaultFingeringPatterns(octaveRange.start);
    if (backendDefaults && backendDefaults.fingerings.length > 0) {
      const converted = backendConfigToFingeringConfig(backendDefaults);
      setFingeringConfig({ ...localDefaults, ...converted });
    } else {
      setFingeringConfig(localDefaults);
    }
  }, [octaveRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateOctaveRange = useCallback((newRange: OctaveRange) => {
    setOctaveRange(newRange);
  }, []);

  const updateFingeringForNote = useCallback((noteKey: string, fingering: FingeringPattern) => {
    setFingeringConfig((prev) => ({
      ...prev,
      [noteKey]: fingering,
    }));
  }, []);

  const resetFingeringToDefaults = useCallback(() => {
    setFingeringConfig(getDefaultFingeringPatterns(octaveRange.start));
  }, [octaveRange]);

  const addNote = useCallback(
    (noteName: NoteName, octave: number, duration: NoteDuration) => {
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random()}`,
        name: noteName,
        octave,
        duration,
      };

      setComposition((prev) => ({
        ...prev,
        notes: [...prev.notes, newNote],
      }));

      setSelectedNoteIndex(composition.notes.length);
    },
    [composition.notes.length]
  );

  const deleteNote = useCallback(
    (index: number) => {
      setComposition((prev) => ({
        ...prev,
        notes: prev.notes.filter((_, i) => i !== index),
      }));

      if (selectedNoteIndex === index) {
        setSelectedNoteIndex(null);
      }
    },
    [selectedNoteIndex]
  );

  const modifyNoteDuration = useCallback((index: number, duration: NoteDuration) => {
    setComposition((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) => (i === index ? { ...note, duration } : note)),
    }));
  }, []);

  const modifyNotePitch = useCallback((index: number, noteName: NoteName, octave: number) => {
    setComposition((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) =>
        i === index ? { ...note, name: noteName, octave } : note
      ),
    }));
  }, []);

  const setNoteLyrics = useCallback((index: number, lyrics: string) => {
    setComposition((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) => (i === index ? { ...note, lyrics } : note)),
    }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setComposition((prev) => ({ ...prev, title }));
  }, []);

  const updateDescription = useCallback((description: string) => {
    setComposition((prev) => ({ ...prev, description }));
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
