import { Weight, WFun, toWFun } from ".";
import { RTU } from "./generators";
import { Random } from "./math";

export function startOf(which = RTU.SUB_NOTE): WFun {
    return state => (state?.clock as number[])?.slice(0, which).every(x => x === 0) ? 1 : 0;
}

export function fracOf(frac: number, which = RTU.SUB_NOTE): WFun {
    const pStart = startOf(which - 1);
    return state => {
        if (!pStart(state)) return 0;
        const tVal = (state?.clock as number[])[which]!;
        const tMax = (state?.clockBases as number[])[which]!;
        return tMax * frac > tVal ? 1 : 0;
    }
}

export function backHistory(amount: Weight, column = RTU.MEASURE): WFun {
    const amount2 = toWFun(amount);
    return state => {
        const a = amount2(state);
        if (!a) return;
        const index = a * (state.clockBases as number[]).slice(column).reduce((a, b) => a * b, 1);
        return (state.history as number[]).at(-index);
    }
}


export function density(den: Weight, window: Weight): WFun {
    const den2 = toWFun(den);
    const win2 = toWFun(window);
    return state => {
        const hist = state.history as number[];
        const winLen = Math.round(win2(state)!);
        const bits = hist.slice(-winLen);
        const tgtDen = den2(state)!;
        const x = bits.reduce((a, b) => a + b, 0) / bits.length - tgtDen;
        return 1 / (1 + Math.exp(-x));
    }
}

// MARK: Higher order WFun

export function pickRand(...choices: (Weight | [Weight, Weight])[]): WFun {
    const fixedChoices = choices.map(v => Array.isArray(v) ? [toWFun(v[0]), toWFun(v[1])] as const : [toWFun(v), () => 1] as const);
    return state => {
        const now = fixedChoices.map(([a, b]) => [a(state), b(state) ?? 1] as const);
        const vThis = now.flatMap(([v, w]) => v !== undefined && !isNaN(w) ? [v] : []);
        const wThis = now.flatMap(([v, w]) => v !== undefined && !isNaN(w) ? [w] : []);
        console.log(vThis, wThis);
        if (vThis.length === 0 || wThis.every(w => w === 0)) return;
        return Random.choose(vThis, wThis);
    }
}

export function reduceMul(...values: Weight[]): WFun {
    const values2 = values.map(toWFun);
    return state => values2.map(v => v(state)).reduce((a, b) => (a ?? 0) * (b ?? 0), 1);
}
