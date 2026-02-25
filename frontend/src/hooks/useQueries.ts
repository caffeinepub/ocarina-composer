import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Composition as BackendComposition, OcarinaFingeringConfig } from '../backend';
import { Composition, FingeringConfiguration, FingeringPattern } from '../types/music';
import { serializeComposition, deserializeComposition } from '../utils/compositionSerializer';

// ─── Composition Queries ────────────────────────────────────────────────────

export function useListCompositions() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, BackendComposition]>>({
    queryKey: ['compositions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCompositions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetComposition(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Composition | null>({
    queryKey: ['composition', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        const backendComp = await actor.getComposition(id);
        return deserializeComposition(new Uint8Array(backendComp.midiData));
      } catch (error) {
        console.error('Error loading composition:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSaveComposition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (composition: Composition): Promise<bigint> => {
      if (!actor) throw new Error('Actor not initialized');
      const serialized = serializeComposition(composition);
      return actor.saveComposition(composition.title, composition.description, serialized);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compositions'] });
    },
  });
}

// ─── Fingering Defaults Queries ─────────────────────────────────────────────

/**
 * Fetch the admin's fingering defaults from the backend.
 * Only enabled when the user is authenticated (isAuthenticated = true).
 */
export function useGetFingeringDefaults(isAuthenticated = false) {
  const { actor, isFetching } = useActor();

  return useQuery<OcarinaFingeringConfig | null>({
    queryKey: ['fingeringDefaults'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getFingeringDefaults();
      } catch {
        // Non-admin callers will get an authorization error — return null silently
        return null;
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

/**
 * Save the admin's fingering defaults to the backend.
 * Only usable when the user is authenticated.
 */
export function useSetFingeringDefaults(isAuthenticated = false) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: OcarinaFingeringConfig): Promise<void> => {
      if (!actor) throw new Error('Actor not initialized');
      if (!isAuthenticated) throw new Error('You must be logged in to save fingering settings.');
      await actor.setFingeringDefaults(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fingeringDefaults'] });
    },
  });
}

/**
 * Reset the admin's fingering defaults on the backend.
 * Only usable when the user is authenticated.
 */
export function useResetFingeringDefaults(isAuthenticated = false) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!actor) throw new Error('Actor not initialized');
      if (!isAuthenticated) throw new Error('You must be logged in to reset fingering settings.');
      await actor.resetFingeringDefaults();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fingeringDefaults'] });
    },
  });
}

// ─── Conversion Helpers ──────────────────────────────────────────────────────

/**
 * Convert backend OcarinaFingeringConfig to frontend FingeringConfiguration.
 *
 * The backend stores fingerings as Array<[Note, Fingering]> where Note is a
 * relative note name string (e.g., 'C', 'C#', ..., 'B', 'C_upper') and
 * Fingering is bool[4].
 *
 * Old absolute keys (e.g., 'C4', 'D#5') from before the migration are also
 * handled: the octave digit is stripped so they map to the shared relative config.
 * If two entries map to the same relative key, the last one wins.
 */
export function backendConfigToFingeringConfig(
  config: OcarinaFingeringConfig
): FingeringConfiguration {
  const result: FingeringConfiguration = {};

  for (const [note, fingering] of config.fingerings) {
    const relativeKey = normalizeNoteKey(note);
    if (relativeKey) {
      result[relativeKey] = {
        leftIndex:   fingering[0] ?? false,
        leftMiddle:  fingering[1] ?? false,
        rightIndex:  fingering[2] ?? false,
        rightMiddle: fingering[3] ?? false,
      };
    }
  }

  return result;
}

/**
 * Normalize a backend note key to a relative key used in the frontend.
 *
 * Handles:
 *   - Already-relative keys: 'C', 'C#', 'D', ..., 'B', 'C_upper' → returned as-is
 *   - Old absolute keys: 'C4', 'D#5' → stripped to 'C', 'D#'
 *     The backend migration converts the upper-octave 'C' to 'C_upper', so
 *     any remaining 'C{digit}' is treated as the root C.
 */
function normalizeNoteKey(note: string): string | null {
  // Already a relative key (no trailing digit, or explicit C_upper)
  if (note === 'C_upper' || /^[A-G]#?$/.test(note)) {
    return note;
  }

  // Strip trailing octave digit(s) from absolute keys like 'C4', 'D#5', 'A#3'
  const match = note.match(/^([A-G]#?)(\d+)$/);
  if (match) {
    return match[1];
  }

  return null;
}

/**
 * Convert frontend FingeringConfiguration to backend OcarinaFingeringConfig.
 * Keys are relative note names (no octave suffix).
 */
export function fingeringConfigToBackendConfig(
  fingeringConfig: FingeringConfiguration,
  name = 'Custom',
  instrumentType = 'Alto C Ocarina'
): OcarinaFingeringConfig {
  const fingerings: Array<[string, boolean[]]> = Object.entries(fingeringConfig).map(
    ([note, pattern]) => [
      note,
      [pattern.leftIndex, pattern.leftMiddle, pattern.rightIndex, pattern.rightMiddle],
    ]
  );
  return { name, instrumentType, fingerings };
}
