import { initAspire } from "./aspire/initGlobalVar";
import { initMyCursor } from "./cursor/init";
import { startAudioDetection } from "./pitch-finder/init";
import { startPitchDetect } from "./pitchdetect/pitchdetect";
import { initButtons } from "./testing/initButtons";
import { initScore } from "./testing/initScore";

document.addEventListener("DOMContentLoaded", (event) => {
  const main = async () => {
    await initAspire();
    const loaded = await aspire.osmd.loadSong(
      "/public/musicxml/twinkle/twinkle.mxl"
    );
    if (loaded) {
      aspire.osmd.instance.render();
      aspire.osmd.instance.cursor.show();
      aspire.loop.start();
    }
    // aspire.osmd.instance.cursor.cursorElement.src = "/public/images/cursor.png";
    initButtons();
    initScore();
    initMyCursor();
    const measures = document.querySelectorAll(".vf-stavenote");
    // startAudioDetection();
    // Add a click event listener to each measure

    // measures.forEach((measure, index) => {
    //   measure.addEventListener("click", () => {
    //     let currentMeasure =
    //       aspire.osmd.instance.Cursor.Iterator.CurrentMeasureIndex;
    //     console.log(`Measure ${index + 1} clicked, On ${currentMeasure}`);
    //     //@ts-ignore
    //     while (currentMeasure < index) {
    //       aspire.osmd.instance.cursor.next();
    //       currentMeasure++;
    //     }
    //     while (currentMeasure > index) {
    //       aspire.osmd.instance.cursor.previous();
    //       currentMeasure--;
    //     }
    //   });
    // });

    // const initMeasureClick = () => {
    //   while (aspire.osmd.instance.Cursor.Iterator.CurrentMeasureIndex < 0) {
    //     aspire.osmd.instance.cursor.next();
    //     aspire.osmd.
    //   }
    // };
  };

  main();
});
