export default (svgText: string) => {
  console.warn('----name--',name);
  var parser = new DOMParser()
  , xmlText =  "<svg xmlns=\'http://www.w3.org/2000/svg\'>" +
    svgText + "</svg>"
  , docElem = parser.parseFromString(xmlText, "text/xml").documentElement

  var node = docElem.firstChild
  if (node) {
    document.importNode(node, true)
    return node

  }
  return ;
};
