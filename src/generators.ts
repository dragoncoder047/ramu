import { State, WFun } from ".";
import { Random } from "./math";

type Tuple<T, Len extends number> = Len extends Len ? number extends Len ? T[] : _TupleOf<T, Len, []> : never;
type _TupleOf<T, Len extends number, Acc extends T[]> = Acc["length"] extends Len ? Acc : _TupleOf<T, Len, [T, ...Acc]>;

export enum RTU {
    SUB_NOTE,
    BEAT,
    MEASURE,
    PHRASE,
    SECTION
};

export function* masterClock(weightMap: Record<RTU, WFun>, reUpRhythmAt = RTU.SECTION) {
    var chosenBases: Tuple<number, 5> = [0, 0, 0, 0, 0];
    const tickers: Tuple<number, 5> = [0, 0, 0, 0, 0];
    const reUp = () => {
        for (var i = RTU.SUB_NOTE; i < chosenBases.length; i++) {
            chosenBases[i] = weightMap[i]!({})!;
        }
    };
    reUp();
    var rollover = 0;
    var state: State = yield;
    for (; ;) {
        state = yield {
            state: {
                clock: tickers,
                clockBases: chosenBases,
                invClock: tickers.map((c, i) => chosenBases[i]! - c),
                clockRollover: rollover,
                timeSlice: 60 / (state.tempo as number) / chosenBases[RTU.SUB_NOTE],
            }
        };
        tickers[0]++;
        rollover = 0;
        for (var i = 0; i < tickers.length; i++) {
            if (tickers[i]! >= chosenBases[i]!) {
                tickers[i] = 0;
                rollover++;
                if (i + 1 < tickers.length) {
                    tickers[i + 1]!++;
                    if (i + 1 === reUpRhythmAt) reUp();
                }
            } else break;
        }
    }
}

export function* constant(obj: Partial<State>, once = true) {
    yield; // consume initial state input
    for (; ;) {
        yield { state: obj as State };
        if (once) (obj as any) = undefined;
    }
}

export function* changeEvery(what: string, when: RTU, fun: WFun) {
    var state: State = yield;
    var val = fun(state)!;
    for (; ;) {
        if ((state.clockRollover as number) >= when)
            val = fun(state)!;
        state = yield { state: { [what]: val } };
    }
}

export function* drumGenerator(drum: string, strengthFun: WFun) {
    const history: number[] = [];
    var state: State = yield;
    for (; ;) {
        const vol = strengthFun({ ...state, history });
        history.push(vol ?? 0);
        state = yield {
            notes: vol && vol > 0 ? [{ instrument: drum, volume: vol, duration: 1 }] : []
        };
    }
}

export function* rootNoteGenerator(changeEvery: RTU, steps: WFun) {
    var state: State = yield;
    var note = state.root as number;
    for (; ;) {
        if ((state.clockRollover as number) >= changeEvery) {
            const howmuch = Math.pow(2, Math.round(steps(state)!) / (state.notesPerOctave as number));
            note *= Random.pickOne(howmuch, -howmuch, 0.5);
        }
        state = yield { state: { root: note } };
    }
}
