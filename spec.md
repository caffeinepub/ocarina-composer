# Specification

## Summary
**Goal:** Add a library of 15 preset songs with guided step-by-step note sequence playback to the Ocarina Composer app.

**Planned changes:**
- Define 15 preset songs as structured note sequence data (title, category, BPM, notes array using existing Note type), grouped into three categories: Classic Folk, Video Games, and Mixed Genres
- Add a Song Library UI panel/modal accessible from the main app layout, listing all 15 songs grouped by category, allowing users to select a song to load into guided playback mode
- Implement a Guided Playback mode that highlights the current note's fingering on the OcarinaIllustration, displays the note name, shows a step counter (e.g., "Step 3 of 24"), plays audio via the existing synthesis system, and includes Play, Pause, Stop, Previous Step, and Next Step controls that auto-advance at the song's BPM
- Add a scrollable step-by-step note sequence guide panel during guided playback showing upcoming notes with small hole indicators, with the current note highlighted and completed notes visually dimmed

**User-visible outcome:** Users can open a Song Library, browse and select from 15 preset songs across three genres, and follow along with an interactive guided playback that shows which ocarina holes to cover at each step, auto-advancing to the song's tempo or allowing manual stepping.
