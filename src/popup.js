function getColorByScore(score) {
  if (score <= 100 && score > 60) {
    return "greenyellow";
  } else if (score <= 60 && score >= 50) {
    return "yellow";
  } else if (score < 50 && score != 0) {
    return "brown";
  } else {
    return "red";
  }
}

const fmtColorStyle = (score) => `color: ${getColorByScore(score)}`;

let score = 100;
const reasonsElement = document.getElementById("reasons");

function addNextReason(title, reducedScore) {
  score -= reducedScore;
  const el = document.createElement("li");
  el.textContent = title;

  reasonsElement.appendChild(el);

  updateScore();
}

function updateScore() {
  const actualScore = document.getElementById("actual-score");
  actualScore.textContent = score.toString();
  actualScore.style = fmtColorStyle(score);
}

const updateScoreFromContentScript = (info) => {
  for (data of info) {
    addNextReason(data.text, data.reducedScore);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: "popup", subject: "DOMInfo" },
        updateScoreFromContentScript
      );
    }
  );
});
