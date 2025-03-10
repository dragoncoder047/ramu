import { Note } from ".";

export interface Instrument {
    id: string;
    play(note: Note, tickLen: number): void;
}
