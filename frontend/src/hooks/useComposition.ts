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
import { useInternetIdentity } from './useInternetIdentity';

const DEFAULT_BASE_OCTAVE = 5;

export function useComposition() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [composition, setComposition] = useState<Composition>({
    title: 'Untitled',
    description: '',
    notes: [],
    timeSignature: { numerator: 4, denominator: 4 },
    tempo: 120,
  });

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [currentPlayingNoteIndex, setCurrentPlayingNoteIndex] = useState<number | null>(null);

  // Octave range — defaults to C5-C6 on first load
  const [octaveRange, setOctaveRange] = useState<OctaveRange>({
    start: DEFAULT_BASE_OCTAVE,
    end: DEFAULT_BASE_OCTAVE + 1,
  });

  // Single shared fingering configuration — octave-independent, keyed by relative note name.
  // Initialized once from factory defaults; NOT regenerated when octave range changes.
  const [fingeringConfig, setFingeringConfig] = useState<FingeringConfiguration>(() =>
    getDefaultFingeringPatterns()
  );

  // Track whether we have already seeded from backend defaults
  const [seededFromBackend, setSeededFromBackend] = useState(false);

  // Only fetch fingering defaults when the user is authenticated
  const { data: backendDefaults } = useGetFingeringDefaults(isAuthenticated);

  // Seed fingering config from backend global defaults on first load ONLY.
  // Octave range changes do NOT trigger this effect.
  // Reset seeded flag when user logs out so it re-seeds on next login.
  useEffect(() => {
    if (!isAuthenticated) {
      setSeededFromBackend(false);
      return;
    }
    if (!seededFromBackend && backendDefaults && backendDefaults.fingerings.length > 0) {
      const converted = backendConfigToFingeringConfig(backendDefaults);
      if (Object.keys(converted).length > 0) {
        setFingeringConfig((prev) => ({ ...prev, ...converted }));
      }
      setSeededFromBackend(true);
    }
  }, [backendDefaults, seededFromBackend, isAuthenticated]);

  // Only updates the octave range — fingering config is intentionally NOT touched
  const updateOctaveRange = useCallback((newRange: OctaveRange) => {
    setOctaveRange(newRange);
  }, []);

  const updateFingeringForNote = useCallback((noteKey: string, fingering: FingeringPattern) => {
    setFingeringConfig((prev) => ({ ...prev, [noteKey]: fingering }));
  }, []);

  const resetFingeringToDefaults = useCallback(() => {
    setFingeringConfig(getDefaultFingeringPatterns());
  }, []);

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
      setSelectedNoteIndex((prev) => {
        // Select the newly added note
        return prev === null ? 0 : prev;
      });
    },
    []
  );

  const deleteNote = useCallback(
    (index: number) => {
      setComposition((prev) => ({
        ...prev,
        notes: prev.notes.filter((_, i) => i !== index),
      }));
      setSelectedNoteIndex((prev) => (prev === index ? null : prev));
    },
    []
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
    isAuthenticated,
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
