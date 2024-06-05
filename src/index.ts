import { ChordDetector } from "./akkorder/ChordDetector";
import { Chromagram } from "./akkorder/Chromagram";

navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then(function (stream) {
    let audioContext = new AudioContext();

    let frameSize = 512;
    let sampleRate = 44100;

    let c = new Chromagram(frameSize, sampleRate); // create a chromagram object
    function process() {
      let frame = new Array(frameSize);
      // do something here to fill the frame with audio samples
      // for now, we'll just fill it with random numbers
      for (let i = 0; i < frameSize; i++) {
        frame[i] = Math.random() * 2 - 1;
      }

      c.processAudioFrame(frame); // process the frame
      if (c.isReady()) {
        let chroma = c.getChromagram();
        let chordDetector = new ChordDetector();
        const result = chordDetector.detectChord(chroma);
        console.log(
          chordDetector.rootNote,
          chordDetector.quality,
          chordDetector.intervals
        );
      }
      //and then call:
      requestAnimationFrame(process);
    }
    process();
  })
  .catch(function (err) {
    console.log("An error occurred: " + err);
  });
