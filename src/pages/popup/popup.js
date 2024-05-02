// async function translateText(text, targetLang) {
//   const apiKey = "279a2e9d-83b3-c416-7e2d-f721593e42a0:fx";
//   // const apiKey = process.env.DEEP_L_AUTH_KEY || "";
//   const url = `https://api-free.deepl.com/v2/translate`;

//   const params = new URLSearchParams();
//   params.append("auth_key", apiKey);
//   params.append("text", text);
//   params.append("target_lang", targetLang);

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       body: params
//     });
//     console.log(response);
//     const data = await response.json();
//     console.log(data);
//     return data.translations[0].text;
//   } catch (error) {
//     console.error("Error translating text:", error);
//   }
// }

document.addEventListener("DOMContentLoaded", function () {
  let slider = document.getElementById("range");
  let output = document.getElementById("label");
  output.innerHTML = `${slider.value}%`;

  slider.oninput = function () {
    output.innerHTML = `${this.value}%`;
  };

  // form submit listener
  const form = document.getElementById("settings");
  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      const percentValue = document.getElementById("range").value;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: async () => {
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
            // const apiKey = "279a2e9d-83b3-c416-7e2d-f721593e42a0:fx";
            // // const apiKey = process.env.DEEP_L_AUTH_KEY || "";
            // const url = `https://api-free.deepl.com/v2/translate`;

            // const params = new URLSearchParams();
            // params.append("auth_key", apiKey);
            // params.append("text", "hello");
            // // params.append("text", text);
            // params.append("target_lang", "SP");
            // // params.append("target_lang", targetLang);

            // try {
            //   const response = await fetch(url, {
            //     method: "POST",
            //     body: params
            //   });
            //   console.log(response);
            //   const data = await response.json();
            //   console.log(data);
            //   return data.translations[0].text;
            // } catch (error) {
            //   console.error("Error translating text:", error);
            // }
          },
          args: [percentValue]
        });
      });
    },
    false
  );
});

function grabPageHtml(data) {
  console.log(data);
  let text = document.getElementsByTagName("h1");
  console.log(text);
  let collectedWords = [];
  Array.from(text).forEach((item) => {
    collectedWords << [item.innerText];
    console.log(item.innerText);
  });
  // translate_words(words)
  // const elementsWithInnerText = Array.from(allElements).filter((el) =>
  //   el.innerText ? el.innerText.trim().length > 0 : null
  // );

  // const categorizedByTagName = elementsWithInnerText.reduce((acc, el) => {
  //   const tagName = el.tagName;
  //   if (!acc[tagName]) {
  //     acc[tagName] = [];
  //   }
  //   acc[tagName].push(el);
  //   return acc;
  // }, {});

  // console.log(categorizedByTagName);
}

// (async function translateText(words) {
//   const targetLang = "fr";
//   const result = await translator.translateText(words, null, targetLang);
//   console.log(result);
//   // word.innerHTML = result;
// })();
