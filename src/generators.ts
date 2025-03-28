import { State, Weight, WFun } from ".";
import { pickRand } from "./weighting";

type Tuple<T, Len extends number> = Len extends Len ? number extends Len ? T[] : _TupleOf<T, Len, []> : never;
type _TupleOf<T, Len extends number, Acc extends T[]> = Acc["length"] extends Len ? Acc : _TupleOf<T, Len, [T, ...Acc]>;

export enum RTU {
    SUB_NOTE,
    BEAT,
    MEASURE,
    PHRASE,
    SECTION
};

export function* masterClock(weightMap: Record<RTU, (Weight | [Weight, Weight])[]>, reUpRhythmAt = RTU.SECTION) {
    var chosenBases: Tuple<number, 5> = [0, 0, 0, 0, 0];
    const tickers: Tuple<number, 5> = [0, 0, 0, 0, 0];
    const weightChoosers = Object.fromEntries(Object.entries(weightMap).map(([k, v]) => [k, pickRand(...v)]));
    const reUp = () => {
        for (var i = 0; i < chosenBases.length; i++) {
            chosenBases[i] = weightChoosers[i]!({})!;
        }
    };
    reUp();
    for (; ;) {
        yield {
            state: {
                clock: tickers,
                clockBases: chosenBases,
                invClock: tickers.map((c, i) => chosenBases[i]! - c)
            }
        };
        tickers[0]++;
        for (var i = 0; i < tickers.length; i++) {
            if (tickers[i]! >= chosenBases[i]!) {
                tickers[i] = 0;
                if (i + 1 < tickers.length) {
                    tickers[i + 1]!++;
                    if (i + 1 === reUpRhythmAt) reUp();
                }
            } else break;
        }
    }
}

export function* drumGenerator(drum: string, strengthFun: WFun) {
    const history: number[] = [];
    var state: State = {};
    for (; ;) {
        const vol = strengthFun({ ...state, history });
        history.push(vol ?? 0);
        state = yield {
            notes: vol && vol > 0 ? [{ instrument: drum, volume: vol, duration: 1 }] : []
        };
    }
}
