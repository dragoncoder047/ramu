import { ZzFXDrumInstrument } from "../src/instruments/zzfx_instrument";
import { AutoSong, SongParams } from "../src";
import { drumGenerator, masterClock, RTU } from "../src/generators";
import { backHistory, fracOf, pickRand, reduceMul, startOf } from "../src/weighting";

const uniforms = {
    repetitiveness: 5,
    beatStrength: 5
};

const songParams: SongParams = {
    root: 220 * Math.pow(2, 7 / 12), // == E4
    notesPerOctave: 12,
    tempo: 400,
    uniforms,
    generators: [
        masterClock([2, 3, 4, 5, 6, 7, 8, 9, 11], [50, 50, 100, 4, 20, 2, 50, 6, 1]),
        drumGenerator("bass",
            pickRand(
                [startOf(RTU.MEASURE), 500],
                [0.2, 1],
                [0, 100],
                [backHistory((state: any) => state.clockBases?.[RTU.BEAT], RTU.BEAT), 100],
                [backHistory((state: any) => state.clockBases?.[RTU.MEASURE], RTU.MEASURE), 50]
            )),
        drumGenerator("snare",
            pickRand(
                [fracOf(0.5, RTU.MEASURE), 500],
                [0.2, 1],
                [0, 10],
                [backHistory((state: any) => state.clockBases?.[RTU.BEAT], RTU.BEAT), 100],
                [backHistory((state: any) => state.clockBases?.[RTU.MEASURE], RTU.MEASURE), 50]
            )),
        drumGenerator("hi-hat",
            pickRand(
                [1, reduceMul(startOf(RTU.BEAT), () => 10)],
                [1, reduceMul(fracOf(0.5, RTU.BEAT), () => 10)],
                [0, 10],
                [backHistory((state: any) => state.clockBases?.[RTU.BEAT], RTU.BEAT), 100],
                [backHistory((state: any) => state.clockBases?.[RTU.MEASURE], RTU.MEASURE), 50]
            )),
    ],
};

const autoSong = new AutoSong(songParams);

const instruments = [
    new ZzFXDrumInstrument("snare", [2, 0, 660, , , .09, 3, , , , , , .2, 2, , , , 1.1]),
    new ZzFXDrumInstrument("bass", [4, 0, 80, , , .2, 1, 4, -2, 6, 50, .15, , 6]),
    new ZzFXDrumInstrument("hi-hat", [, 0, 3520, , , .11, 3, 1.65, , , , , , 2]),
];

function tick() {
    const timeslice = 60 / autoSong.data.tempo;
    const notes = autoSong.step();
    notes.forEach(n => {
        if (n.instrument)
            instruments.find(i => i.id === n.instrument)?.play(n, timeslice);
    });
    dataArea.textContent = JSON.stringify(autoSong.state, undefined, 2);
    setTimeout(tick, timeslice * 1000);
}
// --------------------------------------------------------------

const $ = <T extends HTMLElement>(s: string): T | null => document.querySelector(s);

const startBtn = $<HTMLButtonElement>("#start")!;
const dataArea = $<HTMLPreElement>("#data")!;

startBtn.addEventListener("click", () => {
    startBtn.remove();
    tick();
});
