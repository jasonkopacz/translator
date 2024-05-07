chrome.storage.local.get(["nodes"]).then((result) => {
  console.log("got nodes");
});

document.addEventListener("DOMContentLoaded", function () {
  let slider = document.getElementById("range");
  let output = document.getElementById("label");
  output.innerHTML = `${slider.value}%`;

  slider.oninput = function () {
    output.innerHTML = `${this.value}%`;
  };
});

const form = document.getElementById("settings");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const languageValue = form.languages.value;
  const percentValue = form.range.value;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    console.log(url);
    if (!url.startsWith("chrome://")) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: async (languageValue, percentValue) => {
          console.log(percentValue);
          console.log(languageValue);
          console.log("made it");

          const apiKey = "c933f5cc-cec4-4a2d-8210-ff9375af93b8:fx";
          const url = "https://api-free.deepl.com/v2/translate";
          const headers = {
            Authorization: `DeepL-Auth-Key ${apiKey}`
          };
          const params = new URLSearchParams();
          params.append("text", "hello");
          params.append("target_lang", "DE");
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: headers,
              body: params
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
              return data.translations[0].text;
            } else {
              console.error("Translation failed:", data);
              return null;
            }
          } catch (error) {
            console.error("Error translating text:", error);
            return null;
          }
        },
        args: [percentValue, languageValue]
      });
    } else {
      console.error("Cannot execute script on chrome:// URLs");
    }
  });
});
function selectWords(textNodes, percentage) {
  let allWords = [];
  textNodes.forEach((node) => {
    let words = node.text.split(/\s+/);
    allWords = allWords.concat(words.map((word) => ({ word, node })));
  });
  let selectionCount = Math.floor(allWords.length * (percentage / 100));
  let selectedWords = [];
  while (selectedWords.length < selectionCount) {
    let index = Math.floor(Math.random() * allWords.length);
    selectedWords.push(allWords.splice(index, 1)[0]);
  }
  return selectedWords;
}

function replaceWords(words, translations) {
  words.forEach((entry, index) => {
    let originalText = entry.node.nodeValue;
    let translatedWord = translations[index];
    entry.node.nodeValue = originalText.replace(entry.word, translatedWord);
  });
}
