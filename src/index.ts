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
export type LiteralWeightlist = (Weight | [Weight, Weight])[];
export const toWFun = (x: Weight): WFun => (state: State) => typeof x === "number" ? x : x(state);

export type NoteGenerator = Iterator<{ state?: State, notes?: Note[] } | undefined, void, State>;

export class AutoSong {
    #uniforms: Record<string, number>;
    state: Record<string, number | number[]>;
    generators: NoteGenerator[];

    constructor(uniforms: Record<string, number>, generators: NoteGenerator[]) {
        this.#uniforms = uniforms;
        this.state = {};
        this.generators = generators;
    }

    send(newUniforms: any) {
        Object.assign(this.#uniforms, newUniforms);
    }

    step() {
        const notes: Note[] = [];
        for (const gen of this.generators) {
            const res = gen.next(Object.assign(this.state, this.#uniforms));
            if (res.done) throw new Error("NoteGenerator can never finish");
            if (res) {
                Object.assign(this.state, res.value?.state ?? {});
                if (res.value?.notes) notes.push(...res.value.notes);
            }
        }
        return notes;
    }
}
