export function dissonance(x: number): number {
    // https://cscheid.net/v2/explainers/music/consonance-and-dissonance.html
    // f'(x) = abs(fp(x-1)/(1+f^2(x-1)^2)^2)

    // TODO: parameterize these magic numbers
    const p = 3.1;
    const f = 10;
    const xm1 = x - 1;
    return abs(f * p * xm1 / sq(1 + sq(f) * sq(xm1)));
}



const abs = Math.abs;
const sq = (x: number) => x ** 2;

class RNG {
    random = Math.random;
    randrange(lo: number, hi: number): number {
        return Math.floor(this.random() * (hi - lo)) + lo;
    }
    choose<T>(from: T[], weights?: number[]): T {
        if (!weights) {
            return from[this.randrange(0, from.length)]!;
        } else if (weights.length != from.length) {
            throw new Error("Weights array is not the same length as values array");
        }
        const one = weights.reduce((a, b) => a + b, 0);
        const randVal = this.randrange(0, one);
        var sum = 0;
        for (var i = 0; i < from.length; i++) {
            sum += weights[i]!;
            if (sum > randVal) return from[i]!;
        }
        throw new Error("unreachable");
    }
    percent(pct: number): boolean {
        return pct >= this.randrange(1, 101);
    }

    pickOne<T>(a: T, b: T, bias: number): T {
        const breakpoint = 1 / (1 + Math.exp(-bias));
        return this.choose([a, b], [1 - breakpoint, breakpoint]);
    }
}
export const Random = new RNG;
