document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("settings");
  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      const toggleData = {
        divs: form.divs.checked,
        headers: form.headers.checked,
        content: form.content.checked
      };
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: grabPageHtml,
          args: [toggleData]
        });
      });
    },
    false
  );
});

function grabPageHtml(data) {
  console.log(data);
  const headers = data.headers ? document.getElementsByTagName("h1") : null;
  const divs = data.divs ? document.getElementsByTagName("div") : null;
  const content = data.content ? document.getElementsByTagName("p") : null;
  console.log(divs);
  console.log(headers);
  console.log(content);
  console.log(document.getElementsByTagName("p"));

  const allElements = document.querySelectorAll("*");

  const elementsWithInnerText = Array.from(allElements).filter((el) =>
    el.innerText ? el.innerText.trim().length > 0 : null
  );

  const categorizedByTagName = elementsWithInnerText.reduce((acc, el) => {
    const tagName = el.tagName;
    if (!acc[tagName]) {
      acc[tagName] = [];
    }
    acc[tagName].push(el);
    return acc;
  }, {});

  console.log(categorizedByTagName);
}
