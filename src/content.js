/**
 * @param {Array} score
 */
function usesHTTP(score) {
  if (location.protocol == "HTTP") {
    score.push({
      reducedScore: 40,
      text: "This website uses unprotected HTTP",
    });
  } else {
    score.push({
      reducedScore: 0,
      text: "This website is protected",
    });
  }
}

function isLocalHost(score) {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    score.push({
      reducedScore: 5,
      text: "This website is hosted locally",
    });
  }
}

function getScore() {
  const score = [];

  usesHTTP(score);
  isLocalHost(score);

  return score;
}

chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction",
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    response(getScore());
  }
});
