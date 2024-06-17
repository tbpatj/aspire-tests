import { Container, Graphics, GraphicsContext } from "pixi.js";
import { pixiApp } from "../pixiInstance";
import { AnimLerp } from "../../utils/animations/animLerp";
import { toRadians } from "../../utils/math";

export const loadingScene = () => {
  let centerX = pixiApp.canvas.width / 2;
  let centerY = pixiApp.canvas.height / 2;

  const alphaLerp = new AnimLerp(2);

  let opacity = 0.0;

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
  pixiApp.ticker.add((d) => {
    elapsed += d.deltaTime;
    t += d.deltaTime / 120;
    if (t > 1) {
      t = 0 + (t - Math.floor(t));
    }
    // console.log(t, y);
    spinnerContainer.children.forEach((child, i) => {
      y = i / 10 + t;
      if (y > 1) y = 0 + (y - Math.floor(y));
      y = formula(y);
      //   child.scale.set((y + i + 1) / (iRepeat + 1));
      child.x = Math.sin(y * 2 * Math.PI + Math.PI) * 20; // Set the x position of the duplicate
      child.y = Math.cos(y * 2 * Math.PI + Math.PI) * 20; // Set the y position of the duplicate
      //   child.rotation += 0.1 * delta * (i + 1);
    });
    if (opacity < 1) {
      opacity += d.deltaTime / 100;
    } else opacity = 1;
    spinnerContainer.alpha = opacity;

    // spinnerContainer.angle += 0.1 * delta;
    // spinnerContainer.rotation += 0.1 * delta;
  });
};

// let startValue = 0; // starting value
// let endValue = 100; // ending value
// let duration = 2; // duration in seconds

// let currentValue = startValue; // current value
// let elapsedTime = 0; // elapsed time

// pixiApp.ticker.add((delta) => {
//   elapsedTime += delta.deltaTime / 1000; // convert delta time to seconds

//   if (elapsedTime >= duration) {
//     currentValue = endValue; // reached the end value
//   } else {
//     currentValue = lerp(startValue, endValue, elapsedTime / duration); // interpolate between start and end values
//   }

//   // use the currentValue for whatever you need
// });
