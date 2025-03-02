import { DurationGenerator } from "./generators";
import { FixedWeightedRule as ConstantRule, RemainingInBeatRule } from "./rules";
import { AutoSong, SongParams } from "./song";

const uniforms = {
    repetitiveness: 5,
    beatStrength: 5
};

const songParams: SongParams<typeof uniforms> = {
    root: 220 * Math.pow(2, 7/12),
    notesPerOctave: 12,
    tempo: 120,
    notesPerBeat: 4,
    uniforms,
    generators: [
        new DurationGenerator([
            new ConstantRule({ duration: 1 }, () => 10),
            new ConstantRule({ duration: .5 }, () => 8),
            new ConstantRule({ duration: .25 }, () => 1),
            new ConstantRule({ duration: .75 }, () => 1),
            new RemainingInBeatRule(song => song.data.uniforms.repetitiveness * song.data.uniforms.beatStrength),
        ]),
    ],
};

const autoSong = new AutoSong(songParams);

for (var i = 0; i < 100; i++) {
    console.log(autoSong.getState().beatPos.toFixed(2), autoSong.step());
}
