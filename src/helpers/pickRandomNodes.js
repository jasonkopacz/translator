function pickRandomNodes(nodes, count) {
  if (nodes == {} || nodes === null) return [];
  const shuffled = Object.entries(nodes).sort(() => 0.5 - Math.random());
  const fullNodes = shuffled.slice(0, count);
  const textNodes = fullNodes.map((text) => text[1]);
  return { fullNodes, textNodes };
}
export default pickRandomNodes;
