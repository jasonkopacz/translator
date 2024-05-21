const replaceText = (fullNodes, response) => {
  fullNodes.map((node, index) => {
    let parentNode = document.getElementById(node[0]);
    if (parentNode) {
      let textNode = [...parentNode.childNodes].find(
        (node) => node.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        updateTextNode(parentNode, textNode, response, index);
      }
    }
  });
};
export default replaceText;

const updateTextNode = (parentNode, textNode, response, index) => {
  parentNode.setAttribute("data-original-text", textNode.nodeValue);
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  parentNode.addEventListener("mouseover", showTooltip(tooltip));
  parentNode.addEventListener("mouseout", hideTooltip(tooltip));

  parentNode.style.textDecoration = "underline";
  parentNode.style.textDecorationColor = parentNode.style.color;
  parentNode.style.transition = "text-decoration 0.5s ease";

  textNode.nodeValue = textNode.nodeValue.replace(
    textNode.nodeValue,
    response.translations[index].text
  );
};

const showTooltip = (e, tooltip) => {
  const target = e.target;
  tooltip.textContent = target.getAttribute("data-original-text");
  tooltip.style.left = `${e.pageX + 10}px`;
  tooltip.style.top = `${e.pageY + 10}px`;
  tooltip.style.visibility = "visible";
  tooltip.style.opacity = 1;
};

const hideTooltip = (tooltip) => {
  tooltip.style.visibility = "hidden";
  tooltip.style.opacity = 0;
};
