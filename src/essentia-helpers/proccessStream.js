const processStreamFactory =
  (audioCtx, bufferSize, gain, gumStream, mic, onProcessCallback, scriptNode) =>
  (stream) => {
    gumStream = stream;
    if (gumStream.active) {
      console.log("audio context sample rate = " + audioCtx.sampleRate);

      mic = audioCtx.createMediaStreamSource(stream);
      // We need the buffer size that is a power of two
      if (bufferSize % 2 != 0 || bufferSize < 4096) {
        throw "Choose a buffer size that is a power of two and greater than 4096";
      }
      // In most platforms where the sample rate is 44.1 kHz or 48 kHz,
      // and the default bufferSize will be 4096, giving 10-12 updates/sec.
      console.log("Buffer size = " + bufferSize);
      //resume the listening of the audioctx
      if (audioCtx.state == "suspended") {
        audioCtx.resume();
      }

      scriptNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      // onprocess callback (here we can use essentia.js algos)
      scriptNode.onaudioprocess = onProcessCallback;
      // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
      // As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
      gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      mic.connect(scriptNode);
      scriptNode.connect(gain);
      gain.connect(audioCtx.destination);
    } else {
      throw "Mic stream not active.";
    }
  };

export default processStreamFactory;
