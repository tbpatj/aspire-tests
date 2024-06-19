import { Application, Assets } from "pixi.js";
import base_manifest from "./manifest.json";
import { loadingScene } from "./loading";

export const pixiApp = new Application();

export let pixiElapsed = 0.0;

export const initPixi = async (id = "renderer") => {
  await pixiApp.init({ background: "#ffffff", width: 640, height: 360 });
  const elem = document.getElementById(id);
  if (elem !== null) {
    elem.appendChild(pixiApp.canvas);

    //@ts-ignore
    globalThis.__PIXI_APP__ = pixiApp;
    if (process.env.ENVIRONMENT === "dev") {
    }

    //load assets
    //set up all the bundles that will need to be loaded
    await Assets.init({ manifest: base_manifest });

    //load the loading bundle screen
    //   const result = await Assets.loadBundle("loading");
    const rCB = loadingScene();
    //just a test promise to make sure the loading scene works properly
    await new Promise((resolve) => setTimeout(resolve, 2000));
    //---- load assets here ----

    // assets have been loaded so remove the animation loader
    await rCB();
  }
};
