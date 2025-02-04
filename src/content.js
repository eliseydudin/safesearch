/**
 * @param {Array} score
 */
function usesHTTP(score) {
  if (location.protocol == "https:") {
    score.push({
      reducedScore: 0,
      text: "This website is protected",
    });
  } else {
    score.push({
      reducedScore: 40,
      text: "This website uses unprotected HTTP",
    });
  }
}

function isOld(score) {
  let scoreLocal = 0;

  const tables = document.getElementsByTagName("table").length;
  if (tables > 5) {
    scoreLocal += 5 * (tables - 5);
  }

  if (scoreLocal > 0) {
    score.push({
      reducedScore: scoreLocal,
      text: "This website might be outdated",
    });
  }
}

function isDangerous(score) {
  const API_PATH = "https://hole.cert.pl/domains/v2/domains.txt";
  const DANGEROUS_WEBSITES = ["mos.ru", "mos.olimpiada.ru"];

  fetch(API_PATH)
    .then((data) => data.text())
    .then((data) => data.split("\n"))
    .then((data) => data.find(location.hostname))
    .then((data) => {
      if (data !== undefined) {
        score.push({
          reducedScore: 30,
          text: "This website appears in a list of unsafe websites",
        });
      } else if (DANGEROUS_WEBSITES.find(location.hostname) !== undefined) {
        score.push({ reducedScore: 40, text: "EXTREMELY dangerous website" });
      }
    })
    .catch((error) => console.error(error));
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
  isOld(score);
  isDangerous(score);

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
