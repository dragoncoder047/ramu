import { Random } from "./math";
import { Rule } from "./rules";
import { AutoSong, Note, Uni } from "./song";

export class NoteGenerator<T extends Uni> {
    noteHistory: Note[];
    timeLeftInCurrentNote: number;
    rules: Rule<T>[];

    constructor(rules: Rule<T>[]) {
        this.rules = rules;
        this.noteHistory = [];
        this.timeLeftInCurrentNote = 0;
    }

    apply(song: AutoSong<T>, prevNotes: Note[]): Note {
        throw new Error("Please implement this method");
    }

    reduceRules(song: AutoSong<T>, prevNotes: Note[]): Note {
        if (!this.rules || this.rules.length === 0) {
            throw new Error("No rules to reduce");
        }
        const choices: Note[] = [];
        const weights: number[] = [];
        for (var rule of this.rules) {
            choices.push(rule.getNote(song, this, prevNotes));
            weights.push(rule.getWeight(song, this, prevNotes));
        }
        return Random.choose(choices, weights);
    }

    step(song: AutoSong<T>, prevNotes: Note[]): Note | undefined {
        const beatLen = 1 / song.data.notesPerBeat;
        this.timeLeftInCurrentNote -= beatLen;
        if (this.timeLeftInCurrentNote > 0) return undefined;

        const note = this.apply(song, prevNotes);
        if (note) {
            this.noteHistory.push(note);
            this.timeLeftInCurrentNote = note.duration;
        }
        return note;
    }

    getNoteAt(back: number = 0): Note | undefined {
        if (back > 0) throw new Error("Can't get future note before it happens");
        const hist = this.noteHistory;
        if (!hist.length) return undefined;
        var n = hist.length - 1;
        back += this.timeLeftInCurrentNote;
        while (n >= 0 && back <= 0) {
            back += hist[n]!.duration;
            n--;
        }
        // TODO: this is wrong
        const note = n >= 0 ? hist[n] : undefined;
        if (note) return { ...note, duration: back };
        return undefined;
    }
}

export class RootNoteGenerator<T extends Uni> extends NoteGenerator<T> {
    apply(song: AutoSong<T>, prevNotes: Note[]): Note {
        const notesPerOctave = song.data.notesPerOctave;
        return {
            root: Random.randrange(0, notesPerOctave),
            duration: this.reduceRules(song, prevNotes)?.duration,
        };
    }
}

export class DurationGenerator<T extends Uni> extends NoteGenerator<T> {
    apply(song: AutoSong<T>, prevNotes: Note[]): Note {
        return { duration: this.reduceRules(song, prevNotes).duration };
    }
}

export class DrumTrackGenerator<T extends Uni> extends DurationGenerator<T> {
    instrument: string;
    constructor(rules: Rule<T>[], instrument: string) {
        super(rules);
        this.instrument = instrument;
    }
    apply(song: AutoSong<T>, prevNotes: Note[]): Note {
        return { ...super.apply(song, prevNotes), instrument: this.instrument };
    }
}
