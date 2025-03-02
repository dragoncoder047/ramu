import { DurationGenerator } from "../src/generators";
import { ZzFXDrumInstrument } from "../src/instruments/zzfx_instrument";
import { FixedWeightedRule as ConstantRule, RemainingInBeatRule } from "../src/rules";
import { AutoSong, SongParams } from "../src/song";

const uniforms = {
    repetitiveness: 5,
    beatStrength: 5
};

const songParams: SongParams<typeof uniforms> = {
    root: 220 * Math.pow(2, 7 / 12),
    notesPerOctave: 12,
    tempo: 120,
    notesPerBeat: 4,
    uniforms,
    generators: [
        new DurationGenerator([
            new ConstantRule({ duration: 1 }, () => 10),
            new ConstantRule({ duration: .5 }, () => 8),
            new ConstantRule({ duration: .25 }, () => 1),
            new ConstantRule({ duration: .75 }, () => 1),
            new RemainingInBeatRule(song => song.data.uniforms.repetitiveness * song.data.uniforms.beatStrength),
        ]),
    ],
};

const autoSong = new AutoSong(songParams);

for (var i = 0; i < 100; i++) {
    console.log(autoSong.getState().beatPos!.toFixed(2), autoSong.step());
}

// --------------------------------------------------------------

const $ = <T extends HTMLElement>(s: string): T | null => document.querySelector(s);

const snareDrumInstrument = new ZzFXDrumInstrument("snare", [2, 0, 660, , , .09, 3, , , , , , .2, 2, , , , 1.1]);
const bassDrumInstrument = new ZzFXDrumInstrument("bass", [4, 0, 80, , , .2, 1, 4, -2, 6, 50, .15, , 6]);
const hihatInstrument = new ZzFXDrumInstrument("hihat", [, 0, 3520, , , .11, 3, 1.65, , , , , , 2]);

$("#snare")!.addEventListener("click", () => snareDrumInstrument.play());
$("#bass")!.addEventListener("click", () => bassDrumInstrument.play());
$("#hihat")!.addEventListener("click", () => hihatInstrument.play());
