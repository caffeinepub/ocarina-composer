import { useState, useCallback, useRef, useEffect } from 'react';
import { PresetSong, Note } from '../types/music';
import { getNoteFrequency } from '../utils/ocarinaNoteMapper';
import { createOcarinaSound } from '../utils/audioSynthesis';

export type PlaybackState = 'stopped' | 'playing' | 'paused';

export interface GuidedPlaybackControls {
  currentStep: number;
  totalSteps: number;
  currentNote: Note | null;
  playbackState: PlaybackState;
  play: () => void;
  pause: () => void;
  stop: () => void;
  nextStep: () => void;
  previousStep: () => void;
}

export function useGuidedPlayback(song: PresetSong | null): GuidedPlaybackControls {
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const currentStepRef = useRef(0);
  const songRef = useRef<PresetSong | null>(null);

  // Keep refs in sync
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    songRef.current = song;
  }, [song]);

  // Reset when song changes
  useEffect(() => {
    stopPlayback();
    setCurrentStep(0);
    currentStepRef.current = 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.id]);

  const playNoteAtStep = useCallback((stepIndex: number) => {
    const currentSong = songRef.current;
    if (!currentSong || stepIndex >= currentSong.notes.length) return;

    const note = currentSong.notes[stepIndex];
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const frequency = getNoteFrequency(note.name, note.octave);
    // Duration based on BPM: quarter note = 60/tempo seconds
    const beatDuration = 60 / currentSong.tempo;
    const durationMap: Record<string, number> = {
      whole: beatDuration * 4,
      half: beatDuration * 2,
      quarter: beatDuration,
      eighth: beatDuration / 2,
      sixteenth: beatDuration / 4,
    };
    const duration = durationMap[note.duration] ?? beatDuration;

    createOcarinaSound(audioContext, frequency, duration * 0.9, audioContext.currentTime);
  }, []);

  const stopPlayback = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    const currentSong = songRef.current;
    if (!currentSong || currentSong.notes.length === 0) return;

    // If at end, restart from beginning
    if (currentStepRef.current >= currentSong.notes.length) {
      setCurrentStep(0);
      currentStepRef.current = 0;
    }

    setPlaybackState('playing');

    // Play the current note immediately
    playNoteAtStep(currentStepRef.current);

    // Calculate interval based on current note's duration
    const getIntervalMs = (stepIndex: number): number => {
      const s = songRef.current;
      if (!s || stepIndex >= s.notes.length) return 500;
      const beatDuration = 60 / s.tempo;
      const durationMap: Record<string, number> = {
        whole: beatDuration * 4,
        half: beatDuration * 2,
        quarter: beatDuration,
        eighth: beatDuration / 2,
        sixteenth: beatDuration / 4,
      };
      return (durationMap[s.notes[stepIndex].duration] ?? beatDuration) * 1000;
    };

    // Use a recursive setTimeout approach for variable note durations
    const scheduleNext = (stepIndex: number) => {
      const s = songRef.current;
      if (!s) return;

      const delay = getIntervalMs(stepIndex);
      intervalRef.current = window.setTimeout(() => {
        const nextStep = stepIndex + 1;
        if (nextStep >= (songRef.current?.notes.length ?? 0)) {
          // Song finished
          setPlaybackState('stopped');
          setCurrentStep(0);
          currentStepRef.current = 0;
          intervalRef.current = null;
          return;
        }
        setCurrentStep(nextStep);
        currentStepRef.current = nextStep;
        playNoteAtStep(nextStep);
        scheduleNext(nextStep);
      }, delay);
    };

    scheduleNext(currentStepRef.current);
  }, [playNoteAtStep]);

  const pause = useCallback(() => {
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend();
    }
    setPlaybackState('paused');
  }, []);

  const stop = useCallback(() => {
    stopPlayback();
    setPlaybackState('stopped');
    setCurrentStep(0);
    currentStepRef.current = 0;
  }, [stopPlayback]);

  const nextStep = useCallback(() => {
    const currentSong = songRef.current;
    if (!currentSong) return;
    const next = Math.min(currentStepRef.current + 1, currentSong.notes.length - 1);
    setCurrentStep(next);
    currentStepRef.current = next;
    playNoteAtStep(next);
  }, [playNoteAtStep]);

  const previousStep = useCallback(() => {
    const prev = Math.max(currentStepRef.current - 1, 0);
    setCurrentStep(prev);
    currentStepRef.current = prev;
    playNoteAtStep(prev);
  }, [playNoteAtStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  const totalSteps = song?.notes.length ?? 0;
  const currentNote = song && currentStep < totalSteps ? song.notes[currentStep] : null;

  return {
    currentStep,
    totalSteps,
    currentNote,
    playbackState,
    play,
    pause,
    stop,
    nextStep,
    previousStep,
  };
}
