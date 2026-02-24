import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Composition as BackendComposition } from '../backend';
import { Composition } from '../types/music';
import { serializeComposition, deserializeComposition } from '../utils/compositionSerializer';

export function useListCompositions() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['compositions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCompositions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetComposition(title: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Composition | null>({
    queryKey: ['composition', title],
    queryFn: async () => {
      if (!actor || !title) return null;
      try {
        const backendComp = await actor.getComposition(title);
        return deserializeComposition(new Uint8Array(backendComp.midiData));
      } catch (error) {
        console.error('Error loading composition:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!title,
  });
}

export function useSaveComposition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (composition: Composition) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const serialized = serializeComposition(composition);
      await actor.saveComposition(composition.title, composition.description, serialized);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compositions'] });
    },
  });
}
