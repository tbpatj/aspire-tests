import { OpenSheetMusicDisplay, Pitch } from "opensheetmusicdisplay";
import { initPixi } from "./pixi/pixiInstance";
import { convertMusicXML } from "./utils/musicxaml";
import * as Tone from "tone";

let detector: DectectorNote[] = [];

interface DectectorNote {
  svg: any;
  isRest?: boolean;
  pitch?: Pitch;
  timing?: number;
}

let playing = false;

const song_loc = "/public/musicxml/rhythm_practice.mxl";

const timingConstant = 3000;
document.addEventListener("DOMContentLoaded", (event) => {
  const main = async () => {
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const element = document.getElementById("start-button");
    element?.addEventListener("click", () => {
      if (playing) {
        playing = false;
      } else {
        Tone.start();
        tStart = Date.now();
        updateTiming(0, 0);
        playing = true;
      }
    });
    // initPixi();
    // console.log(musicXmlUrl);
    // const response = await fetch("public/musicxml/chant/Chant.musicxml");
    // const musicXml = await response.text();
    // console.log(musicXml);
    // convertMusicXML(musicXml);
    let osmd = new OpenSheetMusicDisplay("music-container");

    const setCursorNoteGreen = () => {
      const notes = osmd.cursor?.GNotesUnderCursor();
      for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        //@ts-ignore
        const svgEl = note?.getSVGGElement();
        setSVGElementToColor(svgEl, "green");
      }
    };

    const setSVGElementToColor = (svg: any, color: string) => {
      const childExplorer = svg?.children?.[0]?.children;
      for (let i = 0; i < childExplorer.length; i++) {
        const editSvg = childExplorer[i]?.children?.[0];
        if (editSvg) {
          editSvg.style.stroke = color; // stem
          editSvg.style.fill = color; // notehead
        }
      }
    };

    let looping = true;
    let tStart = Date.now();
    let nextElapsed = 0;

    const updateTiming = (currentT: number, nextT: number) => {
      const check = nextT - currentT;
      const overdraw = Date.now() - tStart - nextElapsed;
      nextElapsed = check * timingConstant;
      tStart = Date.now() - overdraw;
    };

    const addCurNotes = () => {
      const notes = osmd.cursor?.GNotesUnderCursor();
      for (let i = 0; i < notes.length; i++) {
        const note = notes[i].sourceNote;
        //@ts-ignore
        const svgEl = notes[i]?.getSVGGElement?.();
        const dNote: DectectorNote = {
          svg: svgEl,
          //@ts-ignore
          isRest: note.isRestFlag,
          pitch: note.Pitch,
          timing: Date.now() + note.Length.RealValue * timingConstant,
        };
        if (dNote?.pitch?.Frequency) {
          const now = Tone.now();
          synth.triggerAttackRelease(
            Math.floor(dNote.pitch.Frequency),
            note.Length.RealValue * timingConstant,
            now
          );
        }
        detector.push(dNote);
      }
    };

    const processNotes = () => {
      const release = [];

      for (let i = 0; i < detector.length; i++) {
        const note = detector[i];
        if (note.timing < Date.now()) {
          if (note?.pitch?.Frequency > 350)
            setSVGElementToColor(note.svg, "blue");
          else setSVGElementToColor(note.svg, "red");

          if (note?.pitch?.Frequency) {
            release.push(Math.floor(note?.pitch?.Frequency));
          }
          detector.splice(i, 1);
        }
      }
      const now = Tone.now();
      synth.triggerRelease(release, now);
    };

    const loop = () => {
      console.log("loop");
      if (playing) {
        if (Date.now() - tStart > nextElapsed) {
          // osmd.render();
          // setCursorNoteGreen();
          osmd.cursor.next();
          const currentT = osmd.Cursor.iterator.currentTimeStamp.RealValue;
          osmd.cursor.next();
          const nextT = osmd.Cursor.Iterator.currentTimeStamp.RealValue;
          updateTiming(currentT, nextT);
          osmd.cursor.previous();
          addCurNotes();
        }
        processNotes();
      }
      if (looping) requestAnimationFrame(loop);
    };

    osmd.setOptions({
      backend: "svg",
      drawTitle: true,
      // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
    });
    osmd.load(song_loc + "").then(function () {
      osmd.render();
      console.log("here");
      osmd.cursor.show();
      setTimeout(() => {
        // Code to be executed after 3 seconds
        tStart = Date.now();
        updateTiming(0, osmd.Cursor.iterator.currentTimeStamp.RealValue);
        loop();
      }, 3000);
    });
  };

  main();
});
