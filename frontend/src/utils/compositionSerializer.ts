import { Composition, Note } from '../types/music';

export function serializeComposition(composition: Composition): Uint8Array {
  const jsonString = JSON.stringify(composition);
  const encoder = new TextEncoder();
  return encoder.encode(jsonString);
}

export function deserializeComposition(data: Uint8Array): Composition {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(data);
  return JSON.parse(jsonString) as Composition;
}
