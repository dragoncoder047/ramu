import { Weight, WFun, wfunify } from ".";
import { RTU } from "./generators";
import { Random } from "./math";

export function startOf(which = RTU.NOTE): WFun {
    return state => (state?.clock as number[])?.slice(0, which).every(x => x === 0) ? 1 : 0;
}

export function fracOf(frac: number, which = RTU.NOTE): WFun {
    const pStart = startOf(which - 1);
    return state => {
        if (!pStart(state)) return 0;
        const tVal = (state?.clock as number[])[which]!;
        const tMax = (state?.clockBases as number[])[which]!;
        return tMax * frac > tVal ? 1 : 0;
    }
}

export function backHistory(amount: Weight, column = RTU.MEASURE): WFun {
    return state => {
        const a = wfunify(amount)(state);
        if (!a) return;
        const index = a * (state.clockBases as number[]).slice(column).reduce((a, b) => a * b, 1);
        return (state.history as number[]).at(-index);
    }
}

// MARK: Higher order WFun

export function pickRand(...choices: (Weight | [Weight, Weight])[]): WFun {
    return state => {
        const now = choices.map(v => Array.isArray(v) ? [wfunify(v[0])(state), wfunify(v[1])?.(state) ?? 1] as const : [wfunify(v)(state), 1] as const);
        const vThis = now.flatMap(([v, _]) => v ? [v] : []);
        const wThis = now.flatMap(([v, w]) => v ? [w] : []);
        if (vThis.length === 0 || wThis.every(w => w === 0)) return;
        return Random.choose(vThis, wThis);
    }
}

export function reduceMul(...values: WFun[]): WFun {
    return state => values.map(v => v(state)).reduce((a, b) => (a ?? 0) * (b ?? 0), 1);
}
