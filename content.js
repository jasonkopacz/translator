function assignIDsAndStoreTextNodes(element, idCounter = { count: 0 }) {
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const trimmedText = child.wholeText.trim();
      const hasLetter = /[a-zA-Z]/.test(trimmedText);
      const isValidText = hasLetter && isVisible(child);
      if (isValidText) {
        if (!child.parentNode.id) {
          child.parentNode.id = `textNode-${idCounter.count++}`;
        }
        chrome.storage.local.set({ [child.parentNode.id]: trimmedText });
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (!["SCRIPT", "STYLE"].includes(child.tagName)) {
        assignIDsAndStoreTextNodes(child, idCounter);
      }
    }
  });
}

function isVisible(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return false;
  }
  const style = window.getComputedStyle(node.parentElement);
  const isInlineStyle = style.display === "none" || style.opacity === "0";

  if (isInlineStyle) {
    return false;
  }
  return true;
}

assignIDsAndStoreTextNodes(document.body);
// const context = document.title;
// chrome.storage.local.set({ context: context });
