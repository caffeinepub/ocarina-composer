import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';

const CHROMATIC_NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Map a note (name + absolute octave) to its relative key in the shared FingeringConfiguration.
 *
 * - 'C' at the base octave → 'C'
 * - 'C#' at base octave → 'C#', etc.
 * - 'C' at (baseOctave + 1) → 'C_upper'
 * - Any note outside the span still maps to its note name (best-effort fallback).
 */
function getRelativeKey(noteName: NoteName, octave: number, baseOctave: number): string {
  if (noteName === 'C' && octave === baseOctave + 1) {
    return 'C_upper';
  }
  return noteName;
}

/**
 * Get the fingering pattern for a note using the shared (octave-independent) configuration.
 *
 * getNoteFingerPattern('C', 3, config, 3) and getNoteFingerPattern('C', 5, config, 5)
 * both return the pattern stored under the key 'C'.
 *
 * @param noteName   - Chromatic note name (e.g. 'C', 'F#')
 * @param octave     - Absolute octave number of the note
 * @param fingeringConfig - Shared fingering configuration (relative keys)
 * @param baseOctave - Base octave of the active range (default 5 for C5–C6)
 */
export function getNoteFingerPattern(
  noteName: NoteName,
  octave: number,
  fingeringConfig: FingeringConfiguration,
  baseOctave = 5
): FingeringPattern {
  const relativeKey = getRelativeKey(noteName, octave, baseOctave);
  return (
    fingeringConfig[relativeKey] ?? {
      leftIndex: false,
      leftMiddle: false,
      rightIndex: false,
      rightMiddle: false,
    }
  );
}

/**
 * Get frequency for a note using equal temperament (A4 = 440 Hz).
 */
export function getNoteFrequency(noteName: NoteName, octave: number): number {
  const noteToSemitone: Record<NoteName, number> = {
    C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5,
    'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
  };
  const semitone = noteToSemitone[noteName];
  const semitonesFromA4 = (octave - 4) * 12 + (semitone - 9);
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}

/**
 * Check whether a note falls within the active ocarina octave range.
 * The range spans C{baseOctave} through C{baseOctave+1} inclusive (13 notes).
 */
export function isNoteInOcarinaRange(
  noteName: NoteName,
  octave: number,
  baseOctave: number
): boolean {
  const semitone = CHROMATIC_NOTES.indexOf(noteName);
  const noteSemitoneAbs = octave * 12 + semitone;
  const rangeLow  = baseOctave * 12;          // C{baseOctave}
  const rangeHigh = (baseOctave + 1) * 12;    // C{baseOctave+1}
  return noteSemitoneAbs >= rangeLow && noteSemitoneAbs <= rangeHigh;
}
