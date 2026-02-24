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
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

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

  const play = useCallback(() => {
    if (notes.length === 0) return;
    
    // Create audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const audioContext = audioContextRef.current;
    setIsPlaying(true);
    
    let currentTime = audioContext.currentTime;
    
    notes.forEach((note, index) => {
      const frequency = getNoteFrequency(note.name, note.octave);
      const duration = getDurationInSeconds(note.duration);
      
      // Schedule the sound
      createOcarinaSound(audioContext, frequency, duration, currentTime);
      
      // Schedule visual feedback
      const startTimeout = window.setTimeout(() => {
        onNoteChange?.(index);
      }, (currentTime - audioContext.currentTime) * 1000);
      
      timeoutIdsRef.current.push(startTimeout);
      
      currentTime += duration;
    });
    
    // Schedule end of playback
    const endTimeout = window.setTimeout(() => {
      setIsPlaying(false);
      onNoteChange?.(null);
    }, (currentTime - audioContextRef.current.currentTime) * 1000);
    
    timeoutIdsRef.current.push(endTimeout);
  }, [notes, getDurationInSeconds, onNoteChange]);

  const stop = useCallback(() => {
    // Clear all timeouts
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];
    
    // Stop audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsPlaying(false);
    onNoteChange?.(null);
  }, [onNoteChange]);

  return {
    isPlaying,
    play,
    stop,
  };
}
