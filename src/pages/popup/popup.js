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
                          parentNode.setAttribute(
                            "data-original-text",
                            textNode.nodeValue
                          );

                          const tooltip = document.createElement("div");
                          tooltip.className = "tooltip";
                          document.body.appendChild(tooltip);

                          const showTooltip = (e) => {
                            const target = e.target;
                            tooltip.textContent =
                              target.getAttribute("data-original-text");
                            tooltip.style.left = `${e.pageX + 10}px`;
                            tooltip.style.top = `${e.pageY + 10}px`;
                            tooltip.style.visibility = "visible";
                            tooltip.style.opacity = 1;
                          };

                          const hideTooltip = () => {
                            tooltip.style.visibility = "hidden";
                            tooltip.style.opacity = 0;
                          };

                          parentNode.addEventListener("mouseover", showTooltip);
                          parentNode.addEventListener("mouseout", hideTooltip);

                          parentNode.style.textDecoration = "underline";
                          parentNode.style.textDecorationColor = "green";
                          parentNode.style.transition =
                            "text-decoration 0.5s ease";
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
