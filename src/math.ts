export function dissonance(x: number): number {
    // https://cscheid.net/v2/explainers/music/consonance-and-dissonance.html
    // f'(x) = abs(fp(x-1)/(1+f^2(x-1)^2)^2)

    // TODO: parameterize these magic numbers
    const p = 3.1;
    const f = 10;
    const xm1 = x - 1;
    return abs(f * p * xm1 / sq(1 + sq(f) * sq(xm1)));
}


export const lerp = (t: number, x: number, y: number) => (1 - t) * x + t * y;
const abs = Math.abs;
const sq = (x: number) => x ** 2;

const NORM_MAGIC = 4 * Math.exp(-1 / 2) * Math.SQRT2;

class RNG {
    random = Math.random;
    randrange(lo: number, hi: number): number {
        return Math.floor(this.random() * (hi - lo)) + lo;
    }
    randint(lo: number, hi: number): number {
        return Math.floor(this.randrange(lo, hi));
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

    gaussian(mu: number, sigma: number): number {
        var z: number;
        do {
            var u1 = this.random();
            var u2 = 1. - this.random();
            z = NORM_MAGIC * (u1 - 1 / 2) / u2;
            var zz = z * z / 4;
        } while (zz > -Math.log(u2));
        return mu + z * sigma;
    }
    subsq(numbers: number[], nextBias: number) {
        for (var p of numbers) {
            const pInv = 1 / p;
            const chance = lerp(nextBias, 1 - pInv, pInv);
            if (this.random() > chance) return p;
        }
        return numbers.at(-1)!;
    }
}
export const Random = new RNG;

export function pitchToFrequency(pitch: number, root: number, notesPerOctave: number): number {
    return root * Math.pow(2, pitch / notesPerOctave);
}
