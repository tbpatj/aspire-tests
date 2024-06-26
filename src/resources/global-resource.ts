import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { DectectorNote } from "./detectorNote-resouce";

export interface GlobalAspire {
  paused: boolean;
  initalized: boolean;
  osmd: OSMDControls;
  audio: AudioControls;
  loop: AspireLoop;
  detector: AspireDetector;
  test?: TestStuff;
  myCursor: MyCursor;
}

export interface OSMDControls {
  songURL: string;
  isSongLoaded: boolean;
  loadSong: (url: string) => Promise<boolean>;
  instance: OpenSheetMusicDisplay;
  setSVGNoteColor: (note: any, color: string) => void;
}

export interface AudioControls {
  isAudioAllowed: boolean;
  allowAudio: () => void;
}

export interface AspireLoop {
  tStart: number;
  nextElapsed: number;
  timingConstant: number;
  start: () => void;
  pause: () => void;
  unpause: () => void;
}

export interface AspireDetector {
  detecting: DectectorNote[];
  score: number;
  lastFrameTime: number;
}

export interface TestStuff {
  scoreElem: HTMLElement;
  // myCursor: HTMLElement;
}

export interface MyCursor {
  elem: HTMLElement;
  curPos: DOMRect;
  nextPos: DOMRect;
}
