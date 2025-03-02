import { Note } from "./song";

export interface Instrument {
    id: string;
    play(note: Note): void;
}
