# Ideas for the implementation of Ramu

<https://procjam.com>

## Top-down look

The system has a list of generators that are called to generate notes.

Each generator generates the random notes by choosing from a set of rules, and the weight of each rule and the note associated with it can be algorithmically determined by both the note history and the uniforms.

## Ideas for data pipeline

* The rhythmic timeunit generator / master clock generates the time divisions for the rhythms (how many notes to the beat, how many beats per measure, how many measures long the phrase, etc).
* The root note generator picks one random pitch and just holds it for the duraction of the phrase. It has a small chance of doing a key-change after this.
* The scale generator picks 5-8 notes, starting with the root note, that sound nice together.
* Chord progression generates chords by picking 3-5 notes from the scale that are (usually) not dissonant next to each other, possibly an inversion, and how long the chord should last for. Changes only up to 1/2 of the notes in each chord at a time.
* The chord feeds into the pad generator directly
* The bassline generator picks notes from the scale but prefers ones from the chord. it is influenced more by the drum track's weights than the melody's weights.
* MelodyGenerators are composed of a PitchGenerator and a RhythmGenerator that are linked
* A PitchGenerator just picks random notes which are weighted using a weights array
* A RhythmGenerator picks random note lengths obeying repetitiveness rules and also allowing a certain heaviness of beats which would make it align to nice lengths more

## Uniforms (can be changed like in a shader)

* Energy - affects the "driving beat" nature
* Suspense - affects the major or minor intervals
* Frenzy - affects the overall tempo, as well as repetition of the same note interval
* Repetitiveness - affects the rhythm and melody
* Weirdness - kind of self-explanatory
