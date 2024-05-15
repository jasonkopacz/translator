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
  const languageValue = document.getElementById("languages").value;
  const percentValue = document.getElementById("range").value;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    if (!url.startsWith("chrome://")) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: async (languageValue, percentValue) => {
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
                return shuffled.slice(0, count);
              }

              const selectedNodes = pickRandomNodes(items, countToProcess);
              // .map((entry) => entry[1])
              // .join(" ");
              console.log(selectedNodes);
              const apiKey = "c933f5cc-cec4-4a2d-8210-ff9375af93b8:fx";
              const url =
                "https://cors-anywhere.herokuapp.com/https://api-free.deepl.com/v2/translate";
              const headers = {
                Authorization: `DeepL-Auth-Key ${apiKey}`
              };
              const params = new URLSearchParams();
              params.append("text", selectedNodes);
              params.append("target_lang", languageValue);

              try {
                const response = await fetch(url, {
                  method: "POST",
                  headers: headers,
                  body: params
                });
                const data = await response.json();

                if (response.ok) {
                  resolve(data.translations[0].text);
                } else {
                  console.error("Translation failed:", data);
                  resolve(null);
                }
              } catch (error) {
                console.error("Error translating text:", error);
                resolve(null);
              }
            });
          });
        },
        args: [languageValue, percentValue]
      });
    } else {
      console.error("Cannot execute script on chrome:// URLs");
    }
  });
});

// selectedNodes.map((node) => {
//   let parentNode = document.getElementById(node[0]);
//   if (parentNode) {
//     let textNode = [...parentNode.childNodes].find(
//       (node) => node.nodeType === Node.TEXT_NODE
//     );
//     if (textNode) {
//       textNode.nodeValue = textNode.nodeValue.replace(
//         textNode.nodeValue,
//         "replacement"
//       );
//     }
//   }
// });
// chrome.storage.local.clear(() => {
//   if (chrome.runtime.lastError) {
//     console.error(
//       "Error clearing local storage:",
//       chrome.runtime.lastError
//     );
//   } else {
//     console.log("Local storage has been cleared.");
//   }
// });
