function assignIDsAndStoreTextNodes(element, idCounter = { count: 0 }) {
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent.trim() !== "" && isVisible(child)) {
        if (!child.parentNode.id) {
          child.parentNode.id = `textNode-${idCounter.count++}`;
        }
        chrome.storage.local.set({
          [child.parentNode.id]: child.textContent.trim()
        });
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
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = range.getClientRects();
  return rects.length > 0 && rects[0].width > 0 && rects[0].height > 0;
}

assignIDsAndStoreTextNodes(document.body);
