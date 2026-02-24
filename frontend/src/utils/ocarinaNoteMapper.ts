import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';

/**
 * Get fingering pattern for a note using user-configured patterns.
 * Returns all-holes-open as a safe default if the note is not in the config.
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
 * Get frequency for a note using equal temperament (A4 = 440 Hz).
 * Supports all chromatic notes from C2 to C8.
 */
export function getNoteFrequency(noteName: NoteName, octave: number): number {
  const noteToSemitone: Record<NoteName, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  };

  // A4 = 440 Hz is our reference (octave 4, note A = semitone 9)
  const semitone = noteToSemitone[noteName];
  const semitonesFromA4 = (octave - 4) * 12 + (semitone - 9);

  return 440 * Math.pow(2, semitonesFromA4 / 12);
}

/**
 * Check whether a note falls within the active ocarina octave range.
 * The range spans from C{baseOctave} through C{baseOctave+1} inclusive.
 */
export function isNoteInOcarinaRange(
  noteName: NoteName,
  octave: number,
  baseOctave: number
): boolean {
  const noteKey = `${noteName}${octave}`;
  const chromaticOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // The range is C{baseOctave} (semitone 0) to C{baseOctave+1} (semitone 12)
  const noteSemitone = octave * 12 + chromaticOrder.indexOf(noteName);
  const rangeLow = baseOctave * 12 + 0;       // C{baseOctave}
  const rangeHigh = (baseOctave + 1) * 12 + 0; // C{baseOctave+1}

  return noteSemitone >= rangeLow && noteSemitone <= rangeHigh;
}
