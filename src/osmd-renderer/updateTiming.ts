export const updateTiming = (currentT: number, nextT: number) => {
  const check = nextT - currentT;
  const overdraw = Date.now() - aspire.loop.tStart - aspire.loop.nextElapsed;
  aspire.loop.nextElapsed = check * aspire.loop.timingConstant;
  aspire.loop.tStart = Date.now() - overdraw;
};
