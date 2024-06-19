export class AnimLerp {
  t: number;
  startT: number;
  elapsed: number;
  duration: number; // in milliseconds

  /**
   * will initialize the animation lerp class with everything needed to start
   * @param iduration - the duration of how long the animation will last in seconds
   */
  constructor(iduration: number) {
    this.t = 0;
    this.startT = Date.now();
    this.elapse();
    this.duration = iduration * 1000;
  }

  /**
   * set the duration of the animation in seconds
   * @param iduration - the duration of how long the animation will last in seconds
   */
  setDuration(iduration: number) {
    this.duration = iduration * 1000;
  }

  /**
   *
   * @param iduration - the duration of how long the animation will last in milliseconds
   */
  setDurationMillis(iduration: number) {
    this.duration = iduration * 1000;
  }

  /**
   * this function starts a new animation, timing, it will reset all the timing and update the duration so the lerp function can be used
   * @param iduration - the duration of how long the animation will last in seconds
   */
  animate(iduration: number) {
    this.duration = iduration * 1000;
    this.start();
  }

  start() {
    this.startT = Date.now();
    this.elapsed = 0;
  }

  /**
   *  a function to get how much time is left in the animation in seconds
   * @returns the time left in the animation in seconds
   */
  timeLeft() {
    this.elapse();
    return (this.duration - this.elapsed) / 1000;
  }

  timeLeftMilis() {
    this.elapse();
    return this.duration - this.elapsed;
  }

  /**
   * start an animation loop from a specific point in the animation based on the value of T
   * @param t - value from 0 - 1 repereseting where the animation should start from 0 being the start and 1 being the end
   * @param duration - the duration of how long the animation will last in seconds
   */
  startFromT(t: number, duration?: number) {
    if (duration) this.duration = duration * 1000;
    this.t = t;
    this.startT = Date.now() - this.t * this.duration;
    this.elapsed = 0;
  }

  /**
   * this function will calculate the time that has passed since the start of the animation
   */
  elapse() {
    this.elapsed = Date.now() - this.startT;
  }

  /**
   * a function to get a value of t based on how much time has passed since the start of the animation 0 being no time passed since, and 1 being the duration has been reached
   * @param capped - a varaible to determine if the t value should be capped at 1 default is true
   * @returns a value of t based on how much time has passed since the start of the animation if capped it goes from 0 - 1
   */
  getT(capped: boolean = true) {
    this.elapse();
    this.t = this.elapsed / this.duration;
    if (capped && this.t > 1) this.t = 1;
    return this.t;
  }

  /**
   * calculates a lerp where t is how much time has passed since the class's start time
   * @param num1 - the start value of the lerp
   * @param num2 - the end value of the lerp
   * @returns a number of the lerp based on the time that has passed since the start of the animation
   */
  lerp(num1: number, num2: number) {
    this.elapse();
    this.t = this.elapsed / this.duration;
    if (this.t > 1) this.t = 1;
    return num1 + (num2 - num1) * this.t;
  }
}
