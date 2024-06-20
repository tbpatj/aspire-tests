import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { GlobalAspire, OSMDControls } from "../resources/global-resource";
import { updateTiming } from "../osmd-renderer/updateTiming";
import { setSVGNoteColor } from "./osmd/noteColor";

export const initOSMD = async () => {
  //init the osmd instance
  aspire.osmd.instance.setOptions({
    backend: "svg",
    drawTitle: true,
    // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
  });

  //set up the load song function
  aspire.osmd.loadSong = async (url: string) => {
    aspire.osmd.isSongLoaded = false;
    try {
      const result = await aspire.osmd.instance.load(url);
      aspire.osmd.isSongLoaded = true;
    } catch (e) {
      console.error(e);
      return false;
    }
    return aspire.osmd.isSongLoaded;
  };

  aspire.osmd.setSVGNoteColor = setSVGNoteColor;
};
