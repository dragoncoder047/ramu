import { State, WFun, wfunify } from ".";
import { Random } from "./math";

type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends T[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export enum RTU {
    NOTE,
    BEAT,
    MEASURE,
    PHRASE,
    SECTION
};

export function* masterClock<const N extends number>(bases: Tuple<number, N>, baseWeights: Tuple<number, N>, reUpRhythmAt = RTU.SECTION) {
    var chosenBases: Tuple<number, 5> = [0, 0, 0, 0, 0];
    const tickers: Tuple<number, 5> = chosenBases.map(_ => 0) as any;
    const reUp = () => {
        chosenBases = chosenBases.map(_ => Random.choose(bases, baseWeights)) as any;
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

export function* drumGenerator(instID: string, strengthFun: WFun) {
    const history: number[] = [];
    var state: State = {};
    for (; ;) {
        const vol = wfunify(strengthFun)({ ...state, history });
        history.push(vol ?? 0);
        state = yield {
            notes: vol && vol > 0 ? [{ instrument: instID, volume: vol, duration: 1 }] : []
        };
    }
}
