import { Container, Graphics, GraphicsContext, Ticker } from "pixi.js";
import { pixiApp } from "../pixiInstance";
import { AnimLerp } from "../../utils/animations/animLerp";
import { toRadians } from "../../utils/math";

const fadeInSecDuration = 0.5;
const fadeOutSecDuration = 0.5;

export const loadingScene = () => {
  let centerX = pixiApp.canvas.width / 2;
  let centerY = pixiApp.canvas.height / 2;

  //animation stuff
  const alphaLerp = new AnimLerp(fadeInSecDuration);
  let alphaMode = 0;
  let opacity = 0;

  const spinnerContainer = new Container();
  spinnerContainer.x = centerX;
  spinnerContainer.y = centerY;

  const circles = new GraphicsContext().circle(0, 0, 10).fill(0x000000);
  const iRepeat = 5;
  const iMul = toRadians(360) / iRepeat;

  for (let i = 0; i < iRepeat; i++) {
    // Initialize the duplicate using our circleContext
    let duplicate = new Graphics(circles);
    duplicate.x = Math.sin(i * iMul) * 20; // Set the x position of the duplicate
    duplicate.y = Math.cos(i * iMul) * 20; // Set the y position of the duplicate
    duplicate.scale.set((i + 1) / (iRepeat + 1));
    spinnerContainer.addChild(duplicate);
    // pixiApp.stage.addChild(duplicate); // Add the duplicate to the stage
  }
  pixiApp.stage.addChild(spinnerContainer);
  let elapsed = 0;
  let t = 0;
  let y = 0;
  const formula = (x: number) => {
    return 1 / (1 + Math.pow(x / (1 - x), -2.5));
  };
  //start the animation timer
  alphaLerp.start();

  const loadingAnim = (d: Ticker) => {
    //create a variable that loops between 0 - 1 on a time based interval
    elapsed += d.deltaTime;
    t += d.deltaTime / 120;
    if (t > 1) {
      t = 0 + (t - Math.floor(t));
    }

    //spin each circle around the center
    spinnerContainer.children.forEach((child, i) => {
      //get a looping time variable so we can keep a loading anim
      y = i / 10 + t;
      if (y > 1) y = 0 + (y - Math.floor(y));
      //get the curve value so it has some character
      y = formula(y);
      //set the position of the child based on the curve
      child.x = Math.sin(y * 2 * Math.PI + Math.PI) * 20; // Set the x position of the child
      child.y = Math.cos(y * 2 * Math.PI + Math.PI) * 20; // Set the y position of the child
    });

    //fade in and fade out animation
    if (alphaMode === 0) {
      opacity = alphaLerp.lerp(0, 1);
      spinnerContainer.alpha = opacity;
    } else if (alphaMode == 1)
      spinnerContainer.alpha = alphaLerp.lerp(opacity, 0);
  };

  pixiApp.ticker.add(loadingAnim);

  const removeCB = async () => {
    alphaLerp.startFromT(1 - opacity, fadeOutSecDuration);
    alphaMode = 1;
    await new Promise((resolve) => setTimeout(resolve, alphaLerp.duration));
    pixiApp.ticker.remove(loadingAnim);
    pixiApp.stage.removeChild(spinnerContainer);
    return true;
  };

  return removeCB;
};
