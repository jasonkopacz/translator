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
  const source_lang = document.getElementById("languages_from").value;
  const languageValue = document.getElementById("languages_to").value;
  const percentValue = document.getElementById("range").value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    if (!url.startsWith("chrome://")) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: async (source_lang, languageValue, percentValue) => {
          return new Promise((resolve, reject) => {
            chrome.storage.local.get(null, async (items) => {
              const countToProcess = Math.floor(
                Object.entries(items).length * (percentValue / 100)
              );

              function pickRandomNodes(nodes, count) {
                if (nodes == {} || nodes === null) return [];
                const shuffled = Object.entries(nodes).sort(
                  () => 0.5 - Math.random()
                );
                const fullNodes = shuffled.slice(0, count);
                const textNodes = fullNodes.map((text) => text[1]);
                return { fullNodes, textNodes };
              }

              const { fullNodes, textNodes } = pickRandomNodes(
                items,
                countToProcess
              );

              chrome.runtime.sendMessage(
                {
                  action: "translateText",
                  text: textNodes,
                  source_lang: source_lang,
                  languageValue: languageValue
                },
                (response) => {
                  if (response.success) {
                    fullNodes.map((node, index) => {
                      let parentNode = document.getElementById(node[0]);
                      if (parentNode) {
                        let textNode = [...parentNode.childNodes].find(
                          (node) => node.nodeType === Node.TEXT_NODE
                        );
                        if (textNode) {
                          textNode.nodeValue = textNode.nodeValue.replace(
                            textNode.nodeValue,
                            response.translations[index].text
                          );
                        }
                      }
                    });
                    chrome.storage.local.clear(() => {
                      if (chrome.runtime.lastError) {
                        console.error(
                          "Error clearing local storage:",
                          chrome.runtime.lastError
                        );
                      } else {
                        console.log("Local storage has been cleared.");
                        return;
                      }
                    });
                  } else {
                    console.error("Translation failed:", response.error);
                    chrome.storage.local.clear(() => {
                      if (chrome.runtime.lastError) {
                        console.error(
                          "Error clearing local storage:",
                          chrome.runtime.lastError
                        );
                      } else {
                        console.log("Local storage has been cleared.");
                        return;
                      }
                    });
                  }
                  return;
                }
              );
              return;
            });
          });
        },
        args: [source_lang, languageValue, percentValue]
      });
    } else {
      console.error("Cannot execute script on chrome:// URLs");
    }
  });
});
