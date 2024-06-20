import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { GlobalAspire, OSMDControls } from "../resources/global-resource";
import { initOSMD } from "./initOsmdFuncs";
import { initLoop } from "../osmd-renderer/loop";

export const initAspire = async () => {
  //create a default object for the global variable
  globalThis.aspire = {
    paused: true,
    initalized: false,
    osmd: {
      songURL: "/public/musicxml/rhythm_practice.mxl",
      isSongLoaded: false,
      instance: new OpenSheetMusicDisplay("music-container"),
      loadSong: async (url: string) => {
        console.log("loader not initialized yet");
        return false;
      },
      setSVGNoteColor: (note: any, color: string) => {
        console.log("color not initialized yet");
      },
    } as OSMDControls,
    audio: {
      isAudioAllowed: false,
      allowAudio: () => {
        console.log("audio allowed");
      },
    },
    loop: {
      tStart: Date.now(),
      nextElapsed: 0,
      timingConstant: 3000,
      start: () => {},
      pause: () => {},
      unpause: () => {},
    },
    detector: {
      detecting: [],
    },
  } as GlobalAspire;

  //initalize helper functions and parameters
  await initOSMD();
  await initLoop();

  aspire.initalized = true;
  return true;
};
