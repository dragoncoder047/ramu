import { ZzFXDrumInstrument } from "../src/instruments/zzfx_instrument";
import { AutoSong, SongParams } from "../src";
import { drumGenerator, masterClock, RTU } from "../src/generators";
import { backHistory, density, fracOf, pickRand, reduceMul, startOf } from "../src/weighting";

const uniforms = {
    // repetitiveness: 5,
    // beatStrength: 5
};

const songParams: SongParams = {
    root: 220 * Math.pow(2, 7 / 12), // == E4
    notesPerOctave: 12,
    tempo: 128,
    uniforms,
    generators: [
        masterClock({
            [RTU.SUB_NOTE]: [[4, 10], [3, 5]],
            [RTU.BEAT]: [[2, 50], [3, 50], [4, 100], [5, 4], [6, 20], [7, 2], [8, 50], [9, 6], [11, 1]],
            [RTU.MEASURE]: [[4, 10], [5, 2], [2, 2]],
            [RTU.PHRASE]: [[4, 10], [2, 1], [6, 2]],
            [RTU.SECTION]: [1]
        }),
        drumGenerator("bass",
            pickRand(
                [1, reduceMul(500, startOf(RTU.BEAT))],
                [0.2, 1],
                [0, 100],
                [density(0.25, 4), reduceMul(density(0.25, 4), 20)],
                [backHistory((state: any) => state.clockBases?.[RTU.BEAT], RTU.BEAT), 100],
                [backHistory((state: any) => state.clockBases?.[RTU.MEASURE], RTU.MEASURE), 50]
            )),
        drumGenerator("snare",
            pickRand(
                [fracOf(0.5, RTU.MEASURE), 500],
                [0.2, 1],
                [0, 10],
                [density(0.2, 4), reduceMul(density(0.8, 4), 20)],
                [backHistory((state: any) => state.clockBases?.[RTU.BEAT], RTU.BEAT), 100],
                [backHistory((state: any) => state.clockBases?.[RTU.MEASURE], RTU.MEASURE), 50]
            )),
        drumGenerator("hi-hat",
            pickRand(
                [1, reduceMul(startOf(RTU.BEAT), 10)],
                [0.8, reduceMul(fracOf(0.5, RTU.BEAT), 10)],
                [0, 10],
                [density(0.8, 4), reduceMul(density(0.2, 4), 20)],
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
    const notes = autoSong.step();
    const timeslice = 60 / autoSong.data.tempo / (autoSong.state.clockBases as any)![RTU.SUB_NOTE]!;
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
