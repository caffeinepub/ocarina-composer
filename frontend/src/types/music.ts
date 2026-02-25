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
 * 4-hole ocarina fingering pattern.
 * true = hole closed, false = hole open.
 */
export interface FingeringPattern {
  leftIndex: boolean;
  leftMiddle: boolean;
  rightIndex: boolean;
  rightMiddle: boolean;
}

/**
 * Fingering configuration map — keyed by RELATIVE chromatic note name (no octave suffix).
 * Keys: 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C_upper'
 *
 * This single shared configuration applies to ALL octaves.
 * 'C_upper' represents the C at the top of the octave span (one octave above the base C).
 */
export type FingeringConfiguration = Record<string, FingeringPattern>;

/**
 * Octave range for the ocarina.
 * Represents a single octave span: C{start} through C{start+1} (13 notes).
 * `start` is the base octave number (e.g., 5 for C5–C6).
 * `end` equals start + 1.
 */
export interface OctaveRange {
  start: number;
  end: number;
}

// ─── Preset Song Types ───────────────────────────────────────────────────────

export type SongCategory = 'Classic Folk' | 'Video Games' | 'Mixed Genres';

export interface PresetSong {
  id: string;
  title: string;
  category: SongCategory;
  tempo: number; // BPM
  notes: Note[];
}
