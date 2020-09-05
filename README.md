# SoundGrid

A song data visualization tool built off the Spotify API. Users search for requested songs and the data is correlated to a color-coded grid.

Spotify song data is broken into segments. Each segment contains a mapping of how closely it corresponds to each of the 12 possible pitches (A, A#/Bb, B, C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab). For the purposes of this visualization, the strongest tone is displayed as the note. This may cause some data discrepancies with chords (ie. if C, E, and G are played together) or with particularly noisy notes.

To Do: 
* Experiment with other display shapes
* Allow user to choose color mappings
* Center last row of grid display (maybe)
