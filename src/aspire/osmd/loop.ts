import { updateMyCursor } from "../../cursor/init";
import { getCurPitchData, isPlaying } from "../../pitchdetect/pitchdetect";
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
      score: 0,
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

function linearizeFrequencyDifference(freq1: number, freq2: number): number {
  const logFreq1 = Math.log2(freq1);
  const logFreq2 = Math.log2(freq2);
  return Math.abs(logFreq1 - logFreq2);
}

const processNotes = () => {
  const data = getCurPitchData();
  const pitch = data?.pitch ?? 1;
  const release = [];
  let rn = Date.now();
  for (let i = 0; i < aspire.detector.detecting.length; i++) {
    rn = Date.now();

    const note = aspire.detector.detecting[i];
    const diff = linearizeFrequencyDifference(
      note?.pitch?.Frequency ?? 1,
      pitch
    );
    if (diff < 0.1) {
      // console.log(diff);
      // console.log(diff / 0.1);
      aspire.detector.detecting[i].score +=
        100 * ((rn - aspire.detector.lastFrameTime) / note.duration);
    }
    if (note.timing < rn) {
      // console.log(note.score);
      aspire.detector.score += note.score;
      // if (note.score > 40)
      aspire.osmd.setSVGNoteColor(
        note.svg,
        `rgb(${(1 - note.score / 50) * 255},${(note.score / 50) * 255},0)`
      );
      // else aspire.osmd.setSVGNoteColor(note.svg, "red");

      if (note?.pitch?.Frequency) {
        release.push(Math.floor(note?.pitch?.Frequency));
      }
      aspire.detector.detecting.splice(i, 1);
    } else {
      const percThroughNote = 1 - (note.timing - rn) / note.duration;
      const t = 50 * percThroughNote || 1;
      // console.log(t);
      const c = note.score / t;
      aspire.osmd.setSVGNoteColor(
        note.svg,
        `rgb(${(1 - c) * 255}, ${c * 255},0)`
        // `rgb(0,${lerp(0, 255, (note.timing - rn) / note.duration)},0)`
      );
      // note.svg.style.transform = "scale(2)";
    }
  }
  //   const now = Tone.now();
  //   synth.triggerRelease(release, now);
};

const loop = () => {
  aspire.detector.lastFrameTime = Date.now();
  if (aspire.test?.scoreElem) {
    aspire.test.scoreElem.innerText = aspire.detector.score
      .toFixed(2)
      .toString();
  }
  if (!aspire.paused && isPlaying) {
    const t = (Date.now() - aspire.loop.tStart) / aspire.loop.nextElapsed;
    if (Date.now() - aspire.loop.tStart > aspire.loop.nextElapsed) {
      // osmd.render();
      // setCursorNoteGreen();
      aspire.osmd.instance.cursor.next();
      aspire.myCursor.curPos =
        aspire.osmd.instance.cursor.cursorElement.getBoundingClientRect();
      const currentT =
        aspire.osmd.instance.Cursor.iterator.currentTimeStamp.RealValue;
      aspire.osmd.instance.cursor.next();
      aspire.myCursor.nextPos =
        aspire.osmd.instance.cursor.cursorElement.getBoundingClientRect();
      const nextT =
        aspire.osmd.instance.Cursor.Iterator.currentTimeStamp.RealValue;
      updateTiming(currentT, nextT);
      aspire.osmd.instance.cursor.previous();
      addCurNotes();
    } else {
      updateMyCursor(t);
    }
    processNotes();
    aspire.osmd.instance.cursor.cursorElement.style.opacity = "0";
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
