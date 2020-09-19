# SoundGrid

SoundGrid is a data visualization tool for songs built off the Spotify API, turning the audio experience of music into a visual canvas. Users search for songs, and the corresponding data is analyzed and transposed to a color-coded grid.

Spotify song data is broken into segments. Each segment contains a mapping of how closely it corresponds to each of 12 possible pitches: A, A#/Bb, B, C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, and G#/Ab. For the purposes of this visualization, the strongest tone is displayed as the note. This may cause some data discrepancies with chords (ie. if C, E, and G are played together) or with particularly noisy notes.

To Do: 
* Experiment with other display shapes
* Deploy to Heroku
