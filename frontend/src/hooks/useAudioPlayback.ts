import { useState, useCallback, useRef } from 'react';
import { Note } from '../types/music';
import { getNoteFrequency } from '../utils/ocarinaNoteMapper';
import { createOcarinaSound } from '../utils/audioSynthesis';

export function useAudioPlayback(
  notes: Note[],
  tempo: number,
  onNoteChange?: (index: number | null) => void
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);
  const pausedAtIndexRef = useRef<number>(0);
  const pausedAtOffsetRef = useRef<number>(0);
  const isRepeatRef = useRef<boolean>(false);

  const getDurationInSeconds = useCallback((duration: string): number => {
    const beatDuration = 60 / tempo;
    switch (duration) {
      case 'whole': return beatDuration * 4;
      case 'half': return beatDuration * 2;
      case 'quarter': return beatDuration;
      case 'eighth': return beatDuration / 2;
      case 'sixteenth': return beatDuration / 4;
      default: return beatDuration;
    }
  }, [tempo]);

  const scheduleFrom = useCallback((startIndex: number, startOffset: number, repeat: boolean) => {
    if (notes.length === 0) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    let currentTime = audioContext.currentTime + startOffset;

    for (let index = startIndex; index < notes.length; index++) {
      const note = notes[index];
      const frequency = getNoteFrequency(note.name, note.octave);
      const duration = getDurationInSeconds(note.duration);

      createOcarinaSound(audioContext, frequency, duration, currentTime);

      const capturedIndex = index;
      const capturedTime = currentTime;
      const startTimeout = window.setTimeout(() => {
        onNoteChange?.(capturedIndex);
        pausedAtIndexRef.current = capturedIndex;
        pausedAtOffsetRef.current = 0;
      }, (capturedTime - audioContext.currentTime) * 1000);

      timeoutIdsRef.current.push(startTimeout);
      currentTime += duration;
    }

    // Schedule end of playback
    const totalDelay = (currentTime - audioContext.currentTime) * 1000;
    const endTimeout = window.setTimeout(() => {
      if (isRepeatRef.current) {
        // Clear timeouts and restart
        timeoutIdsRef.current.forEach(id => clearTimeout(id));
        timeoutIdsRef.current = [];
        pausedAtIndexRef.current = 0;
        pausedAtOffsetRef.current = 0;
        scheduleFrom(0, 0, true);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        pausedAtIndexRef.current = 0;
        pausedAtOffsetRef.current = 0;
        onNoteChange?.(null);
      }
    }, totalDelay);

    timeoutIdsRef.current.push(endTimeout);
  }, [notes, getDurationInSeconds, onNoteChange]);

  const play = useCallback((repeat?: boolean) => {
    if (notes.length === 0) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    isRepeatRef.current = repeat ?? false;
    pausedAtIndexRef.current = 0;
    pausedAtOffsetRef.current = 0;
    setIsPlaying(true);
    setIsPaused(false);

    scheduleFrom(0, 0, isRepeatRef.current);
  }, [notes, scheduleFrom]);

  const pause = useCallback(() => {
    if (!isPlaying || isPaused) return;

    // Clear all pending timeouts
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];

    // Suspend the audio context to freeze audio
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend();
    }

    setIsPaused(true);
    onNoteChange?.(pausedAtIndexRef.current);
  }, [isPlaying, isPaused, onNoteChange]);

  const resume = useCallback(() => {
    if (!isPlaying || !isPaused) return;

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        // After resuming, reschedule remaining notes from the paused index
        timeoutIdsRef.current.forEach(id => clearTimeout(id));
        timeoutIdsRef.current = [];

        // Close old context and create a fresh one to reschedule
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        setIsPaused(false);
        scheduleFrom(pausedAtIndexRef.current, 0, isRepeatRef.current);
      });
    } else {
      // Fallback: just reschedule from paused index
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPaused(false);
      scheduleFrom(pausedAtIndexRef.current, 0, isRepeatRef.current);
    }
  }, [isPlaying, isPaused, scheduleFrom]);

  const stop = useCallback(() => {
    // Clear all timeouts
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];

    // Stop audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    pausedAtIndexRef.current = 0;
    pausedAtOffsetRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    onNoteChange?.(null);
  }, [onNoteChange]);

  return {
    isPlaying,
    isPaused,
    play,
    pause,
    resume,
    stop,
  };
}
