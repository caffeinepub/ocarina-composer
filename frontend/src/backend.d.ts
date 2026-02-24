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
export interface OcarinaFingeringConfig {
    name: string;
    instrumentType: string;
    fingerings: Array<[Note, Fingering]>;
}
export type Fingering = Array<boolean>;
export type Note = string;
export interface backendInterface {
    getComposition(id: bigint): Promise<Composition>;
    getFingeringDefaults(): Promise<OcarinaFingeringConfig>;
    listCompositions(): Promise<Array<[bigint, Composition]>>;
    resetFingeringDefaults(): Promise<void>;
    saveComposition(title: string, description: string, midiData: Uint8Array): Promise<bigint>;
    setFingeringDefaults(config: OcarinaFingeringConfig): Promise<void>;
}
