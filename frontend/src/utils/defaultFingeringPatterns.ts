import { NoteName, FingeringPattern, FingeringConfiguration } from '../types/music';

/**
 * Default fingering patterns for 4-hole ocarina
 * Pattern: leftIndex, leftMiddle, rightIndex, rightMiddle
 * true = closed, false = open
 * 
 * The lowest note in each octave has all holes closed
 * Subsequent notes progressively open holes in a logical sequence.
 */

const chromaticNotes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Generate default fingering patterns for a given octave
 * The pattern follows a logical progression where holes open sequentially
 */
function generateOctavePatterns(octave: number): FingeringConfiguration {
  const patterns: FingeringConfiguration = {};
  
  // Base patterns for chromatic scale - progressive opening from right to left
  const fingeringSequence: FingeringPattern[] = [
    { leftIndex: true, leftMiddle: true, rightIndex: true, rightMiddle: true },   // C - all closed (key note)
    { leftIndex: true, leftMiddle: true, rightIndex: true, rightMiddle: false },  // C#
    { leftIndex: true, leftMiddle: true, rightIndex: false, rightMiddle: false }, // D
    { leftIndex: true, leftMiddle: false, rightIndex: false, rightMiddle: false }, // D#
    { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false }, // E - all open
    { leftIndex: true, leftMiddle: true, rightIndex: true, rightMiddle: false },  // F
    { leftIndex: true, leftMiddle: true, rightIndex: false, rightMiddle: false }, // F#
    { leftIndex: true, leftMiddle: false, rightIndex: false, rightMiddle: false }, // G
    { leftIndex: false, leftMiddle: true, rightIndex: false, rightMiddle: false }, // G#
    { leftIndex: false, leftMiddle: false, rightIndex: true, rightMiddle: false }, // A
    { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: true }, // A#
    { leftIndex: false, leftMiddle: false, rightIndex: false, rightMiddle: false }, // B - all open
  ];
  
  chromaticNotes.forEach((note, index) => {
    patterns[`${note}${octave}`] = fingeringSequence[index];
  });
  
  return patterns;
}

/**
 * Get default fingering patterns for a specific octave range
 * Includes one additional note (C) from the octave above the end octave
 */
export function getDefaultFingeringPatterns(startOctave: number, endOctave: number): FingeringConfiguration {
  const patterns: FingeringConfiguration = {};
  
  for (let octave = startOctave; octave <= endOctave; octave++) {
    const octavePatterns = generateOctavePatterns(octave);
    Object.assign(patterns, octavePatterns);
  }
  
  // Add C from the next octave with all holes open (highest note)
  const nextOctave = endOctave + 1;
  patterns[`C${nextOctave}`] = { 
    leftIndex: false, 
    leftMiddle: false, 
    rightIndex: false, 
    rightMiddle: false 
  };
  
  return patterns;
}

/**
 * Predefined octave ranges
 */
export const OCTAVE_RANGES = [
  { label: 'C3 - C4', start: 3, end: 4 },
  { label: 'C4 - C5', start: 4, end: 5 },
  { label: 'C5 - C6', start: 5, end: 6 },
  { label: 'C6 - C7', start: 6, end: 7 },
] as const;
