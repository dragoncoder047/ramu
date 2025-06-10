from math import gcd
from pprint import pprint

chords = {
    "Major": [0, 4, 7],
    "Minor": [0, 3, 7],
    "RelMinor1stInv": [0, 4, 9],
    "Subdominant2ndInv": [0, 5, 9],
    "Major7th": [0, 4, 7, 11],
    "Minor7th": [0, 3, 7, 10],
    "Major9th": [0, 4, 7, 14],
    "Minor9th": [0, 3, 7, 13],
    "Major6th": [0, 4, 9],
    "Minor6th": [0, 3, 8],
    "Major7th9th": [0, 4, 7, 11, 14],
    "Minor7th9th": [0, 3, 7, 10, 13],
    "Major7th11th": [0, 4, 7, 11, 18],
    "Minor7th11th": [0, 3, 7, 10, 17],
}


chordRatios = {}

for k, v in chords.items():
    v2 = [12 + x for x in v]
    v3 = [gcd(12, x) for x in v2[1:]]
    chordRatios[k] = v3

pprint(chordRatios)
