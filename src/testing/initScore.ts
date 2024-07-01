export const initScore = () => {
  const scoreElem = document.getElementById("total-score");
  if (scoreElem) {
    aspire.test.scoreElem = scoreElem;
  }
};
