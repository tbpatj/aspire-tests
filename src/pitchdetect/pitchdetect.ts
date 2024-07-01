/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
//@ts-ignore
window.AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext = null;
export let isPlaying = false;
let useLoop = false;
let analyser = null;
let DEBUGCANVAS = null;
let mediaStreamSource = null;
var waveCanvas;

export function startPitchDetect() {
  // grab an audio context
  audioContext = new AudioContext();

  // Attempt to get audio input
  navigator.mediaDevices
    .getUserMedia({
      audio: {
        //@ts-ignore
        mandatory: {
          googEchoCancellation: "false",
          googAutoGainControl: "false",
          googNoiseSuppression: "false",
          googHighpassFilter: "false",
        },
        optional: [],
      },
    })
    .then((stream) => {
      isPlaying = true;
      // Create an AudioNode from the stream.
      mediaStreamSource = audioContext.createMediaStreamSource(stream);

      // Connect it to the destination.
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      mediaStreamSource.connect(analyser);
      if (useLoop) updatePitch();
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`${err.name}: ${err.message}`);
      alert("Stream generation failed.");
    });
}

function toggleLiveInput() {
  if (isPlaying) {
    //stop playing and return
    analyser = null;
    isPlaying = false;
    if (!window.cancelAnimationFrame)
      //@ts-ignore
      window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    window.cancelAnimationFrame(rafID);
    return;
  }
  startPitchDetect();
}

var rafID = null;
var buflen = 2048;
var buf = new Float32Array(buflen);

var noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function noteFromPitch(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
  );
}

let SIZE = 2048;
let rms = 0;
function autoCorrelate(buf, sampleRate) {
  // Implements the ACF2+ algorithm
  SIZE = buf.length;
  rms = 0;

  for (let i = 0; i < SIZE; i++) {
    let val = buf[i];
    rms += val * val;
  }
  //sqrt is kinda slow though this is only once maybe need to remove this and just check the
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01)
    // not enough signal
    return -1;

  let r1 = 0,
    r2 = SIZE - 1,
    thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  for (let i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  let c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1,
    maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  let x1 = c[T0 - 1],
    x2 = c[T0],
    x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export function getCurPitchData() {
  analyser.getFloatTimeDomainData(buf);
  let ac = autoCorrelate(buf, audioContext.sampleRate);

  if (ac == -1) {
    //to vague not loud enough
    return {
      pitch: undefined,
      note: undefined,
      detune: undefined,
      rms: rms * rms,
    };
  } else {
    let pitch = ac;
    var note = noteFromPitch(pitch);
    var detune = centsOffFromPitch(pitch, note);
    if (detune == 0) {
      //not enouogh data
    } else {
      return { pitch, note: noteStrings[note % 12], detune, rms: rms * rms };
      console.log(
        `Detected pitch: ${pitch} ${noteStrings[note % 12]} ${
          detune < 0 ? "flat" : "sharp"
        }`
      );
    }
  }
}

function updatePitch() {
  analyser.getFloatTimeDomainData(buf);
  let ac = autoCorrelate(buf, audioContext.sampleRate);
  // TODO: Paint confidence meter on canvasElem here.

  if (DEBUGCANVAS) {
    // This draws the current waveform, useful for debugging
    waveCanvas.clearRect(0, 0, 512, 256);
    waveCanvas.strokeStyle = "red";
    waveCanvas.beginPath();
    waveCanvas.moveTo(0, 0);
    waveCanvas.lineTo(0, 256);
    waveCanvas.moveTo(128, 0);
    waveCanvas.lineTo(128, 256);
    waveCanvas.moveTo(256, 0);
    waveCanvas.lineTo(256, 256);
    waveCanvas.moveTo(384, 0);
    waveCanvas.lineTo(384, 256);
    waveCanvas.moveTo(512, 0);
    waveCanvas.lineTo(512, 256);
    waveCanvas.stroke();
    waveCanvas.strokeStyle = "black";
    waveCanvas.beginPath();
    waveCanvas.moveTo(0, buf[0]);
    for (var i = 1; i < 512; i++) {
      waveCanvas.lineTo(i, 128 + buf[i] * 128);
    }
    waveCanvas.stroke();
  }
  if (ac == -1) {
    // detectorElem.className = "vague";
    // pitchElem.innerText = "--";
    // noteElem.innerText = "-";
    // detuneElem.className = "";
    // detuneAmount.innerText = "--";
  } else {
    // detectorElem.className = "confident";
    let pitch = ac;
    // pitchElem.innerText = Math.round(pitch);
    var note = noteFromPitch(pitch);
    // noteElem.innerHTML = noteStrings[note % 12];
    var detune = centsOffFromPitch(pitch, note);
    if (detune == 0) {
      //   detuneElem.className = "";
      //   detuneAmount.innerHTML = "--";
    } else {
      //   if (detune < 0) detuneElem.className = "flat";
      //   else detuneElem.className = "sharp";
      //   detuneAmount.innerHTML = Math.abs(detune);
      console.log(
        `Detected pitch: ${pitch} ${noteStrings[note % 12]} ${
          detune < 0 ? "flat" : "sharp"
        }`
      );
    }
  }

  if (!window.requestAnimationFrame)
    //@ts-ignore
    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  rafID = window.requestAnimationFrame(updatePitch);
}
