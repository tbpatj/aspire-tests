import { Pitch } from "opensheetmusicdisplay";

export interface DectectorNote {
  svg: any;
  isRest?: boolean;
  pitch?: Pitch;
  timing?: number;
  duration?: number;
}
