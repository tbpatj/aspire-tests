import { initAspire } from "./aspire/initGlobalVar";
import { initButtons } from "./testing/initButtons";

document.addEventListener("DOMContentLoaded", (event) => {
  const main = async () => {
    await initAspire();
    const loaded = await aspire.osmd.loadSong(
      "/public/musicxml/rhythm_practice.mxl"
    );
    if (loaded) {
      aspire.osmd.instance.render();
      aspire.osmd.instance.cursor.show();
      aspire.loop.start();
    }
    initButtons();
  };

  main();
});
