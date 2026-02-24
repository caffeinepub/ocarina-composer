export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

export interface Note {
  id: string;
  name: NoteName;
  octave: number;
  duration: NoteDuration;
  lyrics?: string;
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface Composition {
  title: string;
  description: string;
  notes: Note[];
  timeSignature: TimeSignature;
  tempo: number; // BPM
}

/**
 * 4-hole ocarina fingering pattern
 * Object with 4 boolean values: leftIndex, leftMiddle, rightIndex, rightMiddle
 * true = closed, false = open
 * 
 * Default pattern for the lowest note in any octave (e.g., C4, C5, C6):
 * all holes closed
 * 
 * Highest note (C from next octave, e.g., C6 when base is C5):
 * all holes open (false)
 */
export interface FingeringPattern {
  leftIndex: boolean;
  leftMiddle: boolean;
  rightIndex: boolean;
  rightMiddle: boolean;
}

/**
 * Fingering configuration map
 * Maps note names (e.g., "C5", "D5", "C6") to their fingering patterns
 * Includes one additional C note from the octave above the base octave
 */
export type FingeringConfiguration = Record<string, FingeringPattern>;

/**
 * Octave range for the ocarina.
 * Represents a single octave span: C{start} through C{start+1} (13 notes).
 * The `start` field is the base octave number (e.g., 5 for C5-C6).
 * The `end` field is kept for backward compatibility and equals start + 1.
 */
export interface OctaveRange {
  start: number; // Base octave (e.g., 5 for C5-C6)
  end: number;   // Top note octave = start + 1
}
