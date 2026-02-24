# Specification

## Summary
**Goal:** Reorganize the music editor layout and implement vertical wrapping for sheet music.

**Planned changes:**
- Update SheetMusic component to wrap vertically when reaching the screen edge, similar to OcarinaTablature behavior
- Reorganize MusicEditor component to display elements in order from top to bottom: ocarina illustration, piano keyboard, ocarina tablature, sheet music, and lyrics editor

**User-visible outcome:** Sheet music will wrap to new lines instead of extending horizontally, and the editor layout will show tablature above sheet music with all components in a consistent vertical order.
