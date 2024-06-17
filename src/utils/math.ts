export const toRadians = (deg: number) => (deg * Math.PI) / 180.0;
export const toDegrees = (rad: number) => (rad * 180.0) / Math.PI;

export function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}
