import { NoteGenerator } from "./generators";

export type Note = {
    duration: number;
    pitch?: number;
    instrument?: string;
    volume?: number;
    pan?: number;
} & Record<string, any>;

export type Uni = Record<string, number | number[]>;

export interface SongParams<T extends Uni> {
    root: number;
    notesPerOctave: number;
    tempo: number;
    notesPerBeat: number;
    uniforms: T;
    generators: NoteGenerator<T>[];
}

export class AutoSong<T extends Uni> {
    data: SongParams<T>;
    #stateHistory: Record<string, number>[];
    #state: Record<string, number>;

    constructor(data: SongParams<T>) {
        this.data = data;
        this.#stateHistory = [];
        this.#state = { time: 0, beatPos: 0 };
    }

    send(newUniforms: Partial<T>) {
        Object.assign(this.data.uniforms, newUniforms);
    }

    step() {
        const out: Note[] = [];
        for (const gen of this.data.generators) {
            const note = gen.step(this, out);
            if (note) out.push(note);
        }
        this.#state.time! += 1 / this.data.notesPerBeat;
        this.#state.beatPos = this.#state.time! % 1;
        this.#stateHistory.push({ ...this.#state });
        return out;
    }

    getState(back: number = 0): Record<string, number> {
        if (back > 0) throw new Error("Can't get future state before it happens");
        if (back === 0) return this.#state;
        return this.#stateHistory.at(back)!;
    }

    pitchToFrequency(pitch: number): number {
        return this.data.root * Math.pow(2, pitch / this.data.notesPerOctave);
    }
}
