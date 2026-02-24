import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';

/**
 * Get fingering pattern for a note using user-configured patterns
 */
export function getNoteFingerPattern(
  noteName: NoteName,
  octave: number,
  fingeringConfig: FingeringConfiguration
): FingeringPattern {
  const noteKey = `${noteName}${octave}`;
  return fingeringConfig[noteKey] || { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false };
}

/**
 * Get frequency for a note (supports wider range including C6 at 1046.50 Hz)
 */
export function getNoteFrequency(noteName: NoteName, octave: number): number {
  const noteToSemitone: Record<NoteName, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };
  
  // A4 = 440 Hz is our reference (octave 4, note A = semitone 9)
  const semitone = noteToSemitone[noteName];
  const semitonesFromA4 = (octave - 4) * 12 + (semitone - 9);
  
  // Calculate frequency using equal temperament formula
  // C6 = 1046.50 Hz (two octaves above C4 = 261.63 Hz)
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}
