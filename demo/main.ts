import { AutoSong } from "../src";
import { changeEvery, constant, drumGenerator, masterClock, rootNoteGenerator, RTU } from "../src/generators";
import { ZzFXDrumInstrument, ZzFXInstrument } from "../src/instruments/zzfx_instrument";
import { backHistory, consonanceOfInterval, density, fracOf, pickRand, reduceMul, startOf } from "../src/weighting";

const uniforms = {
    // repetitiveness: 5,
    // beatStrength: 5
};

const autoSong = new AutoSong(uniforms, [
    constant({
        root: 220 * Math.pow(2, 7 / 12), /* E4 */
        notesPerOctave: 12,
        tempo: 128,
    }),
    masterClock({
        [RTU.SUB_NOTE]: pickRand([4, 2], [3, 1]),
        [RTU.BEAT]: pickRand([2, 50], [3, 50], [4, 100], [5, 4], [6, 20], [7, 2], [8, 50], [9, 6], [11, 1]),
        [RTU.MEASURE]: pickRand([4, 10], [5, 2], [8, 2]),
        [RTU.PHRASE]: pickRand([4, 10], [2, 1], [6, 2], [1, 5]),
        [RTU.SECTION]: () => 1
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
    changeEvery("notesPerOctave", RTU.SECTION,
        pickRand(
            [12, 1000],
            [24, 200],
            [31, 2],
            [33, 2],
            [43, 3],
        )),
    rootNoteGenerator(RTU.SECTION,
        pickRand(
            [1, consonanceOfInterval(1)],
            [2, consonanceOfInterval(2)],
            [3, consonanceOfInterval(3)],
        )),
]);

const instruments = [
    new ZzFXDrumInstrument("snare", [2, 0, 660, , , .09, 3, , , , , , .2, 2, , , , 1.1]),
    new ZzFXDrumInstrument("bass", [4, 0, 80, , , .2, 1, 4, -2, 6, 50, .15, , 6]),
    new ZzFXDrumInstrument("hi-hat", [, 0, 3520, , , .11, 3, 1.65, , , , , , 2]),
    new ZzFXInstrument("square", [, 0, , , 1, , , 0, , , , , , , , , , .8, .05]),
    new ZzFXInstrument("sine", [, 0, , , 1, , , , , , , , , , , , , .8, .05]),
];

function tick() {
    const notes = autoSong.step();
    notes.forEach(n => {
        if (n.instrument)
            instruments.find(i => i.id === n.instrument)?.play(n, autoSong.state.timeSlice as number);
    });
    dataArea.textContent = JSON.stringify(autoSong.state, undefined, 2);
    setTimeout(tick, autoSong.state.timeSlice as number * 1000);
}
// --------------------------------------------------------------

const $ = <T extends HTMLElement>(s: string): T | null => document.querySelector(s);

const startBtn = $<HTMLButtonElement>("#start")!;
const dataArea = $<HTMLPreElement>("#data")!;

startBtn.addEventListener("click", () => {
    startBtn.remove();
    tick();
});
