chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translateText") {
    const target_lang = request.languageValue;
    const source_lang = request.source_lang;
    if (request["text"].length === 0) {
      sendResponse({ success: false, error: "No text to translate" });
      return true;
    }
    console.log(request["text"]);
    const text = request["text"].filter((item) => {
      console.log(typeof item);
      console.log(item);
      return item.trim() !== "";
    });

    const proxyUrl =
      "https://rjt6plnozavg5fau4ywgo7noie0bjgdr.lambda-url.us-east-2.on.aws/";

    const headers = {
      "Content-Type": "application/json"
    };

    fetch(encodeURI(proxyUrl), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        text: text,
        source_lang: source_lang,
        target_lang: target_lang
        // context: context
      })
    })
      .then((response) => {
        console.log("response", response);
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        sendResponse({ success: true, translation: data.text });
      })
      .catch((error) => {
        console.log("error", error);
        console.error("Error translating text:", error);
        sendResponse({ success: false, error: error });
      });

    return true;
  }
});
