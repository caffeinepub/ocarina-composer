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
      const id = await actor.saveComposition(
        composition.title,
        composition.description,
        serialized
      );
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compositions'] });
    },
  });
}

// ─── Fingering Defaults Queries ─────────────────────────────────────────────

export function useGetFingeringDefaults() {
  const { actor, isFetching } = useActor();

  return useQuery<OcarinaFingeringConfig | null>({
    queryKey: ['fingeringDefaults'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFingeringDefaults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetFingeringDefaults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: OcarinaFingeringConfig): Promise<void> => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.setFingeringDefaults(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fingeringDefaults'] });
    },
  });
}

export function useResetFingeringDefaults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.resetFingeringDefaults();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fingeringDefaults'] });
    },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert backend OcarinaFingeringConfig to frontend FingeringConfiguration.
 * The backend stores fingerings as [Note, Fingering][] where Fingering is bool[].
 * The frontend uses Record<string, FingeringPattern> with named hole keys.
 */
export function backendConfigToFingeringConfig(
  config: OcarinaFingeringConfig
): FingeringConfiguration {
  const result: FingeringConfiguration = {};
  for (const [note, fingering] of config.fingerings) {
    result[note] = {
      leftIndex: fingering[0] ?? false,
      leftMiddle: fingering[1] ?? false,
      rightIndex: fingering[2] ?? false,
      rightMiddle: fingering[3] ?? false,
    };
  }
  return result;
}

/**
 * Convert frontend FingeringConfiguration to backend OcarinaFingeringConfig.
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
