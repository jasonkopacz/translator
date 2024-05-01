// import * as deepl from "deepl-node";

// const authKey = process.env.DEEP_L_AUTH_KEY || "";
// const translator = new deepl.Translator(authKey);
// // const allText = document.body.innerText;

// const word = document.getElementById("one") || null;
// (async () => {
//   const targetLang = "fr";
//   const result = await translator.translateText(word, null, targetLang);
//   console.log(result);
//   word.innerHTML = result;
// })();

document.addEventListener("DOMContentLoaded", function () {
  const grabHtmlButton = document.getElementById("grabHtml");
  console.log(grabHtmlButton);
  grabHtmlButton.addEventListener("click", function () {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        const url = tabs[0].url;
        console.log(url);
        if (!url.startsWith("chrome://")) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: grabPageHtml
          });
        } else {
          console.error("Cannot execute script on chrome:// URLs");
        }
      },
      false
    );
  });
});

function grabPageHtml() {
  console.log("here");
  const htmlContent = document.documentElement.outerHTML;
  console.log(htmlContent);
}
