# Specification

## Summary
**Goal:** Extend the piano keyboard to span multiple octaves and add ocarina base octave settings so users can compose for lower or higher pitched ocarinas.

**Planned changes:**
- Update `PianoKeyboard` component to render keys across at least C3–C7 (4+ octaves) with scrollable layout, and visually highlight the keys belonging to the currently active ocarina octave range
- Add a base octave selector (e.g., dropdown) to `OcarinaSettingsDialog` allowing users to choose from C3–C4, C4–C5, C5–C6, or C6–C7 as the active ocarina range
- Update `defaultFingeringPatterns` utility to accept a base octave parameter and generate the correct 13-note progressive fingering map for any supported octave
- Update `ocarinaNoteMapper` utility to cover frequency and fingering pattern lookups for all chromatic notes from C3 to C7
- Update `useComposition` hook to store the active octave range, regenerate default fingering patterns when the octave changes, and propagate the range to all relevant components (`PianoKeyboard`, `OcarinaIllustration`, `OcarinaTablature`, `SheetMusic`)

**User-visible outcome:** Users can select a base octave for their ocarina in settings, the piano keyboard spans multiple octaves with the active ocarina range highlighted, and fingering patterns automatically update to match the selected octave — all without losing previously composed notes.
