import { KEYS } from "./keys";

let confidence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let myhpcp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let divNote = null;

document.addEventListener("DOMContentLoaded", () => {
  // Your code here
  divNote = document.getElementById("note");
});

const updateConfidence = () => {
  for (let key in confidence) {
    confidence[key] = confidence[key] * 0.9;
  }

  if (divNote) {
    const test = confidence
      .map((k, i) => {
        myhpcp[i] = myhpcp[i] * 0.9;
        return { n: KEYS[i], v: k.toFixed(2) };
      })
      .sort((a, b) => b.v - a.v);
    divNote.innerHTML = test[0].n + " " + test[1].n + " " + test[2].n;
  }
  //   console.log(confidence);

  requestAnimationFrame(updateConfidence);
};

export { confidence, updateConfidence, myhpcp };
