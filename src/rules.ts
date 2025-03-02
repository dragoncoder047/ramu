import { NoteGenerator } from "./generators";
import { AutoSong, Note, Uni } from "./song";

export class Rule<T extends Uni> {
    getNote(song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]): Note {
        throw new Error("Please implement this method");
    }
    getWeight(song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]): number {
        throw new Error("Please implement this method");
    }
}

export class FixedWeightedRule<T extends Uni> extends Rule<T> {
    value: Note;
    getWeight: (song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]) => number;
    constructor(value: Note, getWeight: (song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]) => number) {
        super();
        this.value = value;
        this.getWeight = getWeight;
    }
    getNote() {
        return this.value;
    }
}

export class RepeatRule<T extends Uni> extends Rule<T> {
    backBeats: number;
    getWeight: (song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]) => number;
    constructor(backBeats: number, getWeight: (song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]) => number) {
        super();
        this.backBeats = backBeats;
        this.getWeight = getWeight;
    }
    getNote(song: AutoSong<T>, generator: NoteGenerator<T>): Note {
        return generator.getNoteAt(this.backBeats)!;
    }
}

export class RemainingInBeatRule<T extends Uni> extends Rule<T> {
    getWeight: (song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]) => number;
    constructor(getWeight: (song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]) => number) {
        super();
        this.getWeight = getWeight;
    }
    getNote(song: AutoSong<T>, generator: NoteGenerator<T>): Note {
        return { duration: 1 - song.getState().beatPos! };
    }
}

export class AmplifiedRule<T extends Uni> extends Rule<T> {
    
    child: Rule<T>;
    amplificationFactor: number;

    constructor(child: Rule<T>, amplificationFactor: number) {
        super();
        this.child = child;
        this.amplificationFactor = amplificationFactor;
    }

    getNote(song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]): Note {
        return this.child.getNote(song, generator, prevNotes);
    }

    getWeight(song: AutoSong<T>, generator: NoteGenerator<T>, prevNotes: Note[]): number {
        return this.child.getWeight(song, generator, prevNotes) * this.amplificationFactor;
    }
}
