export type Note = {
    duration: number;
    pitch?: number;
    instrument?: string;
    volume?: number;
    pan?: number;
} & Record<string, any>;

export type State = Record<string, number | number[]>;
export type WFun = (state: State) => number | undefined;
export type Weight = number | WFun;
export const toWFun = (x: Weight): WFun => (state: State) => typeof x === "number" ? x : x(state);

export type NoteGenerator = Iterator<{ state?: State, notes?: Note[] }, void, State>;

export interface SongParams {
    root: number;
    notesPerOctave: number;
    tempo: number;
    uniforms: any;
    generators: NoteGenerator[];
}

export class AutoSong {
    data: SongParams;
    state: Record<string, number>;

    constructor(data: SongParams) {
        this.data = data;
        this.state = { ...data.uniforms };
    }

    send(newUniforms: any) {
        Object.assign(this.data.uniforms, newUniforms);
    }

    step() {
        const notes: Note[] = [];
        for (const gen of this.data.generators) {
            const res = gen.next(Object.assign(this.state, this.data.uniforms));
            if (res.done) throw new Error("NoteGenerator can never finish");
            if (res) {
                Object.assign(this.state, res.value.state);
                if (res.value.notes) notes.push(...res.value.notes);
            }
        }
        return notes;
    }

    pitchToFrequency(pitch: number): number {
        return this.data.root * Math.pow(2, pitch / this.data.notesPerOctave);
    }
}
