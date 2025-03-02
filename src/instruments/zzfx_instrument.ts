import { ZZFX } from "zzfx";
import { Instrument } from "../instrument";
import { Note } from "../song";

const defaultParams = [
    /* volume = */ 1,
    /* randomness = */ .05,
    /* frequency = */ 220,
    /* attack = */ 0,
    /* sustain = */ 0,
    /* release = */ .1,
    /* shape = */ 0,
    /* shapeCurve = */ 1,
    /* slide = */ 0,
    /* deltaSlide = */ 0,
    /* pitchJump = */ 0,
    /* pitchJumpTime = */ 0,
    /* repeatTime = */ 0,
    /* noise = */ 0,
    /* modulation = */ 0,
    /* bitCrush = */ 0,
    /* delay = */ 0,
    /* sustainVolume = */ 1,
    /* decay = */ 0,
    /* tremolo = */ 0,
    /* filter = */ 0
] as const;

const defaultPitchMod = [2, 11, 12, 14, 19];

export class ZzFXDrumInstrument implements Instrument {
    id: string;
    zzArray: number[];
    constructor(id: string, zzArray: (number | undefined)[]) {
        this.zzArray = defaultParams.map((d, i) => zzArray[i] ?? d);
        // this.zzArray[1] = 0; // allow zero randomness here!!
        this.id = id;
    }
    play(note?: Note): AudioBufferSourceNode | undefined {
        const zz = this.zzArray.slice();
        // set master volume
        zz[0]! *= note?.volume ?? 1;
        return ZZFX.play(...zz);
    }
}

export class ZzFXInstrument extends ZzFXDrumInstrument{
    pitchMod: number[];
    constructor(id: string, zzArray: (number | undefined)[], pitchMod = defaultPitchMod) {
        super(id, zzArray);
        this.pitchMod = pitchMod;
    }
    play(note: Note) {
        if (!note.pitch) return;
        const zz = this.zzArray.slice();
        // set master volume
        zz[0]! *= note.volume ?? 1;
        // set pitch
        for (var i of this.pitchMod) zz[i]! *= note.pitch;
        // set sustain from duration and attack time
        zz[4]! = Math.max(0, note.duration - zz[3]!);
        return ZZFX.play(...zz);
    }
}
