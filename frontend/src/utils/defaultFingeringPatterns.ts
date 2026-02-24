import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';

/**
 * Default fingering patterns for 4-hole ocarina
 * Pattern: leftIndex, leftMiddle, rightIndex, rightMiddle
 * true = closed, false = open
 * 
 * The lowest note in each octave has all holes closed
 * Subsequent notes progressively open holes in a logical sequence.
 * The highest note (C from next octave) has all holes open.
 */

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * The fingering sequence for a single octave (12 notes + 1 extra C)
 * Holes open progressively from right to left as pitch rises.
 */
const fingeringSequence: FingeringPattern[] = [
  { leftIndex: true,  leftMiddle: true,  rightIndex: true,  rightMiddle: true  }, // C  - all closed (root)
  { leftIndex: true,  leftMiddle: true,  rightIndex: true,  rightMiddle: false }, // C#
  { leftIndex: true,  leftMiddle: true,  rightIndex: false, rightMiddle: false }, // D
  { leftIndex: true,  leftMiddle: false, rightIndex: false, rightMiddle: false }, // D#
  { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false }, // E  - all open
  { leftIndex: true,  leftMiddle: true,  rightIndex: true,  rightMiddle: false }, // F
  { leftIndex: true,  leftMiddle: true,  rightIndex: false, rightMiddle: false }, // F#
  { leftIndex: true,  leftMiddle: false, rightIndex: false, rightMiddle: false }, // G
  { leftIndex: false, leftMiddle: true,  rightIndex: false, rightMiddle: false }, // G#
  { leftIndex: false, leftMiddle: false, rightIndex: true,  rightMiddle: false }, // A
  { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: true  }, // A#
  { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false }, // B  - all open
];

/**
 * Generate default fingering patterns for a given base octave.
 * An ocarina spans one octave: from C{baseOctave} through C{baseOctave+1} (13 notes total).
 * 
 * @param baseOctave - The starting octave (e.g., 5 for C5-C6)
 * @returns FingeringConfiguration with 13 note entries
 */
export function getDefaultFingeringPatterns(baseOctave: number): FingeringConfiguration {
  const patterns: FingeringConfiguration = {};

  // Generate the 12 chromatic notes for the base octave
  chromaticNotes.forEach((note, index) => {
    patterns[`${note}${baseOctave}`] = fingeringSequence[index];
  });

  // Add C from the next octave with all holes open (highest note)
  patterns[`C${baseOctave + 1}`] = {
    leftIndex: false,
    leftMiddle: false,
    rightIndex: false,
    rightMiddle: false,
  };

  return patterns;
}

/**
 * Predefined ocarina octave ranges.
 * Each range represents a single octave span (13 notes: C{start} through C{start+1}).
 * The `start` field is the base octave number.
 */
export const OCTAVE_RANGES = [
  { label: 'C3 - C4', start: 3 },
  { label: 'C4 - C5', start: 4 },
  { label: 'C5 - C6', start: 5 },
  { label: 'C6 - C7', start: 6 },
] as const;

export type OctaveRangeOption = typeof OCTAVE_RANGES[number];
