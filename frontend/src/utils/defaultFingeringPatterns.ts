import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';

/**
 * Default fingering patterns for a 4-hole ocarina.
 * Pattern fields: leftIndex, leftMiddle, rightIndex, rightMiddle
 * true = closed, false = open
 *
 * This is a SINGLE shared configuration keyed by relative note name (no octave suffix).
 * It applies identically to every octave (C3–C4, C4–C5, C5–C6, C6–C7, etc.).
 * 'C_upper' is the C at the top of the span (all holes open).
 */

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Fingering sequence for a single octave (12 chromatic notes).
 * Holes open progressively from right to left as pitch rises.
 */
const fingeringSequence: FingeringPattern[] = [
  { leftIndex: true,  leftMiddle: true,  rightIndex: true,  rightMiddle: true  }, // C  – all closed
  { leftIndex: true,  leftMiddle: true,  rightIndex: true,  rightMiddle: false }, // C#
  { leftIndex: true,  leftMiddle: true,  rightIndex: false, rightMiddle: false }, // D
  { leftIndex: true,  leftMiddle: false, rightIndex: false, rightMiddle: false }, // D#
  { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false }, // E  – all open
  { leftIndex: true,  leftMiddle: true,  rightIndex: true,  rightMiddle: false }, // F
  { leftIndex: true,  leftMiddle: true,  rightIndex: false, rightMiddle: false }, // F#
  { leftIndex: true,  leftMiddle: false, rightIndex: false, rightMiddle: false }, // G
  { leftIndex: false, leftMiddle: true,  rightIndex: false, rightMiddle: false }, // G#
  { leftIndex: false, leftMiddle: false, rightIndex: true,  rightMiddle: false }, // A
  { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: true  }, // A#
  { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false }, // B  – all open
];

/**
 * Generate the single shared default fingering configuration.
 * Returns 13 entries keyed by relative note name (no octave suffix).
 * This configuration is octave-independent and applies to all octave ranges.
 */
export function getDefaultFingeringPatterns(): FingeringConfiguration {
  const patterns: FingeringConfiguration = {};

  chromaticNotes.forEach((note, index) => {
    patterns[note] = fingeringSequence[index];
  });

  // C_upper: the C at the top of the octave span — all holes open
  patterns['C_upper'] = {
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
 */
export const OCTAVE_RANGES = [
  { label: 'C3 - C4', start: 3 },
  { label: 'C4 - C5', start: 4 },
  { label: 'C5 - C6', start: 5 },
  { label: 'C6 - C7', start: 6 },
] as const;

export type OctaveRangeOption = typeof OCTAVE_RANGES[number];
