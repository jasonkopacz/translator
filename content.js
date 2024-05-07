function extractTextNodes(node, nodes = []) {
  function generatePath(node) {
    if (!node.parentNode || node === document.body) return "";
    let siblings = Array.from(node.parentNode.childNodes).filter(
      (n) => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE
    );
    let index = siblings.indexOf(node) + 1; // XPath is 1-based index
    let nodeName = node.nodeType === Node.TEXT_NODE ? "#text" : node.nodeName;

    return `${generatePath(node.parentNode)}/${nodeName}[${index}]`;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    if (node.nodeValue.trim() !== "" && isNodeVisible(node.parentNode)) {
      let path = generatePath(node);
      // console.log(path);
      nodes.push({ text: node.nodeValue, path: path });
    }
  } else {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      !["SCRIPT", "STYLE"].includes(node.tagName)
    ) {
      node.childNodes.forEach((child) => extractTextNodes(child, nodes));
    }
  }
  return nodes;
}

const textNodes = extractTextNodes(document.body);
chrome.storage.local.set({ nodes: textNodes }).then(() => {
  // console.log("Text nodes data is set");
  // console.log(textNodes);
});

function isNodeVisible(element) {
  if (!element) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}
