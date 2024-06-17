import { confidence, myhpcp } from "./confidence";
import essentia from "./essentiaInstance";
import { KEYS } from "./keys";

const onRecordEssentiaFeatureExtractor = (event) => {
  let audioBuffer = event.inputBuffer.getChannelData(0);

  // compute RMS for thresholding:
  const rms = essentia.RMS(essentia.arrayToVector(audioBuffer)).rms;
  //   console.log(rms);
  if (rms >= 0.05) {
    //compute hpcp for overlapping frames of audio
    const hpcp = essentia.hpcpExtractor(audioBuffer);
    // console.log(`raw ${hpcp}`);

    const scaledHPCP = hpcp.map((i) => 100 * Math.tanh(Math.pow(i * 0.5, 2)));
    // console.log(`scaled ${scaledHPCP}`);
    // let greatest = 0;
    // let greatestIndx = -1;
    KEYS.map((k, i) => {
      myhpcp[i] = scaledHPCP[i];
      confidence[i] += scaledHPCP[i];
      //   return { n: k, v: scaledHPCP[i].toFixed(2) };
    });
    // myhpcp = scaledHPCP;
    // console.log(test);
    // console.log(divNote);
    // const divNote = document.getElementById("note");
    // for (let i = 0; i < scaledHPCP.length; i++) {
    //   if (scaledHPCP[i] > greatest) {
    //     greatest = scaledHPCP[i];
    //     greatestIndx = i;
    //   }
    // }
  }
};

export default onRecordEssentiaFeatureExtractor;
