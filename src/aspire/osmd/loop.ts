import { DectectorNote } from "../../resources/detectorNote-resouce";
import { lerp } from "../../utils/math";
import { updateTiming } from "./updateTiming";

const addCurNotes = () => {
  const notes = aspire.osmd.instance.cursor?.GNotesUnderCursor();
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i].sourceNote;
    //@ts-ignore
    const svgEl = notes[i]?.getSVGGElement?.();
    const dNote: DectectorNote = {
      svg: svgEl,
      //@ts-ignore
      isRest: note.isRestFlag,
      pitch: note.Pitch,
      timing: Date.now() + note.Length.RealValue * aspire.loop.timingConstant,
      duration: note.Length.RealValue * aspire.loop.timingConstant,
    };
    if (dNote?.pitch?.Frequency) {
      //synth stuff
      //   const now = Tone.now();
      //   synth.triggerAttackRelease(
      //     Math.floor(dNote.pitch.Frequency),
      //     note.Length.RealValue * timingConstant,
      //     now
      //   );
    }
    aspire.detector.detecting.push(dNote);
  }
};

const processNotes = () => {
  const release = [];
  let rn = Date.now();
  for (let i = 0; i < aspire.detector.detecting.length; i++) {
    rn = Date.now();

    const note = aspire.detector.detecting[i];
    if (note.timing < rn) {
      if (note?.pitch?.Frequency > 350)
        aspire.osmd.setSVGNoteColor(note.svg, "blue");
      else aspire.osmd.setSVGNoteColor(note.svg, "red");

      if (note?.pitch?.Frequency) {
        release.push(Math.floor(note?.pitch?.Frequency));
      }
      aspire.detector.detecting.splice(i, 1);
    } else {
      aspire.osmd.setSVGNoteColor(
        note.svg,
        `rgb(${lerp(255, 0, (note.timing - rn) / note.duration)},0,0)`
      );
    }
  }
  //   const now = Tone.now();
  //   synth.triggerRelease(release, now);
};

const loop = () => {
  if (!aspire.paused) {
    if (Date.now() - aspire.loop.tStart > aspire.loop.nextElapsed) {
      // osmd.render();
      // setCursorNoteGreen();
      aspire.osmd.instance.cursor.next();
      const currentT =
        aspire.osmd.instance.Cursor.iterator.currentTimeStamp.RealValue;
      aspire.osmd.instance.cursor.next();
      const nextT =
        aspire.osmd.instance.Cursor.Iterator.currentTimeStamp.RealValue;
      updateTiming(currentT, nextT);
      aspire.osmd.instance.cursor.previous();
      addCurNotes();
    }
    processNotes();
  }
  requestAnimationFrame(loop);
};

const pause = () => {
  aspire.paused = true;
};

const unpause = () => {
  aspire.paused = false;
  aspire.loop.tStart = Date.now();
  updateTiming(0, 0);
};

export const startLoop = () => {
  aspire.loop.tStart = Date.now();
  loop();
};

export const initLoop = async () => {
  aspire.loop.start = startLoop;
  aspire.loop.nextElapsed = aspire.loop.timingConstant;
  aspire.loop.pause = pause;
  aspire.loop.unpause = unpause;
};
