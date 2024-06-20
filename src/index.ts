import { OpenSheetMusicDisplay, Pitch } from "opensheetmusicdisplay";
import { initPixi } from "./pixi/pixiInstance";
import { convertMusicXML } from "./utils/musicxaml";
import * as Tone from "tone";
import { lerp } from "./utils/math";
import { DectectorNote } from "./resources/detectorNote-resouce";
import { GlobalAspire } from "./resources/global-resource";
import { initAspire } from "./aspire/initGlobalVar";

// let detector: DectectorNote[] = [];

// let playing = false;

// const song_loc = "/public/musicxml/rhythm_practice.mxl";

// const timingConstant = 3000;
document.addEventListener("DOMContentLoaded", (event) => {
  const main = async () => {
    /// -----------------------------------
    // //create a synth and connect it to the main output (your speakers)
    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();

    // const addPlayButton = () => {
    //   const element = document.getElementById("start-button");
    //   element?.addEventListener("click", () => {
    //     if (playing) {
    //       playing = false;
    //     } else {
    //       Tone.start();
    //       tStart = Date.now();
    //       updateTiming(0, 0);
    //       playing = true;
    //     }
    //   });
    // };
    /// -----------------------------------

    // initPixi();
    // console.log(musicXmlUrl);
    // const response = await fetch("public/musicxml/chant/Chant.musicxml");
    // const musicXml = await response.text();
    // console.log(musicXml);
    // convertMusicXML(musicXml);

    /// -----------------------------------
    // const setCursorNoteGreen = () => {
    //   const notes = osmd.cursor?.GNotesUnderCursor();
    //   for (let i = 0; i < notes.length; i++) {
    //     const note = notes[i];
    //     //@ts-ignore
    //     const svgEl = note?.getSVGGElement();
    //     setSVGElementToColor(svgEl, "green");
    //   }
    // };

    // const setSVGElementToColor = (svg: any, color: string) => {
    //   const childExplorer = svg?.children?.[0]?.children;
    //   for (let i = 0; i < childExplorer.length; i++) {
    //     const editSvg = childExplorer[i]?.children?.[0];
    //     if (editSvg) {
    //       editSvg.style.stroke = color; // stem
    //       editSvg.style.fill = color; // notehead
    //     }
    //   }
    // };

    // const addCurNotes = () => {
    //   const notes = osmd.cursor?.GNotesUnderCursor();
    //   for (let i = 0; i < notes.length; i++) {
    //     const note = notes[i].sourceNote;
    //     //@ts-ignore
    //     const svgEl = notes[i]?.getSVGGElement?.();
    //     const dNote: DectectorNote = {
    //       svg: svgEl,
    //       //@ts-ignore
    //       isRest: note.isRestFlag,
    //       pitch: note.Pitch,
    //       timing: Date.now() + note.Length.RealValue * timingConstant,
    //       duration: note.Length.RealValue * timingConstant,
    //     };
    //     if (dNote?.pitch?.Frequency) {
    //       const now = Tone.now();
    //       synth.triggerAttackRelease(
    //         Math.floor(dNote.pitch.Frequency),
    //         note.Length.RealValue * timingConstant,
    //         now
    //       );
    //     }
    //     detector.push(dNote);
    //   }
    // };

    // const processNotes = () => {
    //   const release = [];
    //   let rn = Date.now();
    //   for (let i = 0; i < detector.length; i++) {
    //     rn = Date.now();

    //     const note = detector[i];
    //     if (note.timing < rn) {
    //       if (note?.pitch?.Frequency > 350)
    //         setSVGElementToColor(note.svg, "blue");
    //       else setSVGElementToColor(note.svg, "red");

    //       if (note?.pitch?.Frequency) {
    //         release.push(Math.floor(note?.pitch?.Frequency));
    //       }
    //       detector.splice(i, 1);
    //     } else {
    //       setSVGElementToColor(
    //         note.svg,
    //         `rgb(${lerp(255, 0, (note.timing - rn) / note.duration)},0,0)`
    //       );
    //     }
    //   }
    //   const now = Tone.now();
    //   synth.triggerRelease(release, now);
    // };
    /// -----------------------------------

    await initAspire();
    const loaded = await aspire.osmd.loadSong(
      "/public/musicxml/rhythm_practice.mxl"
    );
    if (loaded) {
      aspire.osmd.instance.render();
      aspire.osmd.instance.cursor.show();
      aspire.loop.start();
    }
    // initButtons();
  };

  main();
});
