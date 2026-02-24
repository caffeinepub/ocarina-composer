import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Composition {
    midiData: Uint8Array;
    title: string;
    description: string;
}
export interface backendInterface {
    getComposition(title: string): Promise<Composition>;
    listCompositions(): Promise<Array<string>>;
    saveComposition(title: string, description: string, midiData: Uint8Array): Promise<void>;
}
