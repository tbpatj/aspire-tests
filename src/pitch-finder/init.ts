import * as Pitchfinder from "pitchfinder";

// export const startAudioDetection = async () => {
//   const myAudioBuffer = getAudioBuffer(); // assume this returns a WebAudio AudioBuffer object
//   const float32Array = myAudioBuffer.getChannelData(0); // get a single channel of sound

//   const detectPitch = Pitchfinder.AMDF();
//   const pitch = detectPitch(float32Array);
// };

export async function startAudioDetection() {
  try {
    // Request access to the microphone
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const audioContext = new (window.AudioContext ||
      //@ts-ignore
      window.webkitAudioContext)();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a ScriptProcessorNode with a buffer size of 4096 and a single input and output channel
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    // Connect the MediaStreamSource to the processor
    mediaStreamSource.connect(processor);
    processor.connect(audioContext.destination);

    // Create a Pitchfinder instance
    const detectPitch = Pitchfinder.AMDF();

    processor.onaudioprocess = (event) => {
      // Get the audio buffer
      const buffer = event.inputBuffer.getChannelData(0);
      // Detect pitch
      const pitch = detectPitch(buffer);
      if (pitch) {
        console.log(`Detected pitch: ${pitch}`);
      }
    };
  } catch (error) {
    console.error("Error accessing the microphone", error);
  }
}
