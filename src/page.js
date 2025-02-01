/* this script operates the popup */

/**
 *
 * @param {number} score
 * @returns {string}
 */
function getColorByScore(score) {
  if (score == 100) {
    return "greenyellow";
  } else if (score < 100 && score > 30) {
    return "yellow";
  } else if (score < 30 && score != 0) {
    return "brown";
  } else {
    return "red";
  }
}

/**
 *
 * @param {number} score
 * @returns {string}
 */
const fmtColorStyle = (score) => `color: ${getColorByScore(score)}`;

const score = 20;
const reasons = [
  "this website doesn't use tls",
  "recently appeared in an unsafe website list",
];

const actualScore = document.getElementById("actual-score");
actualScore.textContent = score.toString();
actualScore.style = fmtColorStyle(score);

const reasonsElement = document.getElementById("reasons");
reasons.forEach((text) => {
  const el = document.createElement("li");
  el.textContent = text;

  reasonsElement.appendChild(el);
});
