//imports derived from https://mtg.github.io/essentia.js/docs/api/tutorial-1.%20Getting%20started.html resource
import { updateConfidence } from "./confidence";
import essentia from "./essentiaInstance";
import onRecordEssentiaFeatureExtractor from ".featureExtractor";
import processStreamFactory from ".proccessStream";

//initialize essentia.js
//global var for web audio api
let audioCtx;
//buffer size microphone stream (bufferSize is high in order to make PitchYinProbabilistic work)
let bufferSize = 8192;
let hopSize = 2048;

let mic, scriptNode, gain;

try {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
} catch (e) {
  throw "Could not instantiate AudioContext: " + e.message;
}

//global var getUserMedia mic stream
let gumStream;

const startMic = (audioCtx, bufferSize, onProcessCallback, btnCallback) => {
  navigator.getUsermedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  //actual processing function made from a factory function
  const processStream = processStreamFactory(
    audioCtx,
    bufferSize,
    gain,
    gumStream,
    mic,
    onProcessCallback,
    scriptNode
  );

  const processingError = (message) => {
    console.log("Error initializing audio processing: " + message);
  };

  if (navigator.getUserMedia) {
    console.log("initializing audio...");
    navigator.getUserMedia(
      { audio: true, video: false },
      processStream,
      processingError
    );
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
};

startMic(audioCtx, bufferSize, onRecordEssentiaFeatureExtractor);
updateConfidence();
