import { lerp } from "../utils/math";

export const initMyCursor = () => {
  const cursor = document.createElement("div");
  cursor.style.position = "absolute";
  cursor.style.width = "5px";
  cursor.style.height = "40px";
  cursor.style.left = "0px";
  cursor.style.top = "0px";
  cursor.style.backgroundColor = "black";
  //   cursor.style.transition = "left 0.1s";
  document.body.appendChild(cursor);
  aspire.myCursor.elem = cursor;
};

export const updateMyCursor = (t: number) => {
  const v = lerp(aspire.myCursor.curPos.x, aspire.myCursor.nextPos.x, t);
  aspire.myCursor.elem.style.left = `${v + 0}px`;
  aspire.myCursor.elem.style.top = `${aspire.myCursor.curPos.y}px`;
};
