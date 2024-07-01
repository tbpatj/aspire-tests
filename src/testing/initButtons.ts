import { startPitchDetect } from "../pitchdetect/pitchdetect";

export const initButtons = () => {
  const pauseButton = document.getElementById("pause-button");
  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      if (aspire.paused) {
        startPitchDetect();
        aspire.loop.unpause();
        pauseButton.innerText = "Pause";
      } else {
        aspire.loop.pause();
        pauseButton.innerText = "Play";
      }
    });
  }
};
