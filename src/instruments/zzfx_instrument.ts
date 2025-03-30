import { ZZFX } from "zzfx";
import { Instrument } from "../instrument";
import { Note } from "..";

const defaultParams = [
    /* 0: volume = */ 1,
    /* 1: randomness = */ .05,
    /* 2: frequency = */ 220,
    /* 3: attack = */ 0,
    /* 4: sustain = */ 0,
    /* 5: release = */ .1,
    /* 6: shape = */ 0,
    /* 7: shapeCurve = */ 1,
    /* 8: slide = */ 0,
    /* 9: deltaSlide = */ 0,
    /* 10: pitchJump = */ 0,
    /* 11: pitchJumpTime = */ 0,
    /* 12: repeatTime = */ 0,
    /* 13: noise = */ 0,
    /* 14: modulation = */ 0,
    /* 15: bitCrush = */ 0,
    /* 16: delay = */ 0,
    /* 17: sustainVolume = */ 1,
    /* 18: decay = */ 0,
    /* 19: tremolo = */ 0,
    /* 20: filter = */ 0
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
    play(note: Note, _tickLen: number): AudioBufferSourceNode | undefined {
        const zz = this.zzArray.slice();
        // set master volume
        zz[0]! *= note.volume ?? 1;
        return ZZFX.play(...zz);
    }
}

export class ZzFXInstrument extends ZzFXDrumInstrument {
    pitchMod: number[];
    constructor(id: string, zzArray: (number | undefined)[], pitchMod = defaultPitchMod) {
        super(id, zzArray);
        this.pitchMod = pitchMod;
    }
    play(note: Note, tickLen: number) {
        if (!note.pitch) return;
        const zz = this.zzArray.slice();
        // set master volume
        zz[0]! *= note.volume ?? 1;
        // set pitch
        for (var i of this.pitchMod) zz[i]! *= note.pitch / (defaultParams[i] ?? 1);
        // set sustain from duration and attack time
        zz[4]! = Math.max(0, note.duration * tickLen - zz[3]!);
        return ZZFX.play(...zz);
    }
}
