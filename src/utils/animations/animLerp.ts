export class AnimLerp {
  t: number;
  startT: number;
  elapsed: number;
  duration: number;

  constructor(iduration: number) {
    this.t = 0;
    this.startT = 0;
    this.elapsed = 0;
    this.duration = iduration;
  }

  setDuration(iduration: number) {
    this.duration = iduration;
  }

  startLerp() {
    this.startT = Date.now();
    this.elapsed = 0;
  }

  lerp(num1: number, num2: number) {
    this.elapsed = Date.now() - this.startT;
    this.t = this.elapsed / this.duration;
    if (this.t > 1) this.t = 1;
    return num1 + (num2 - num1) * this.t;
  }
}
