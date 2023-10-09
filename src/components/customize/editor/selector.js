export const svgDragSelectElementTypes = window !== undefined ? [SVGCircleElement, SVGEllipseElement, SVGImageElement, SVGLineElement, SVGPathElement, SVGPolygonElement, SVGPolylineElement, SVGRectElement, SVGTextElement, SVGUseElement, SVGGElement] : []

const collectElements = function (into, svg, ancestor, filter) {
  for (let element = ancestor.firstElementChild; element; element = element.nextElementSibling) {
    if (element instanceof SVGGElement) {
      collectElements(into, svg, element, filter);
      continue;
    }
    for (let _i = 0, svgDragSelectElementTypes_1 = svgDragSelectElementTypes; _i < svgDragSelectElementTypes_1.length; _i++) {
      let elementType = svgDragSelectElementTypes_1[_i];

      if (element instanceof elementType && filter(element)) {
        into.push(element);
      }
    }
  }
  return into;
}

const inRange = function (x, min, max) { return (min <= x && x <= max); }

const intersects = function (areaInSvgCoordinate, bbox) {
  let left = areaInSvgCoordinate.x;
  let right = left + areaInSvgCoordinate.width;
  let top = areaInSvgCoordinate.y;
  let bottom = top + areaInSvgCoordinate.height;
  return ((inRange(bbox.x, left, right) || inRange(bbox.x + bbox.width, left, right) || inRange(left, bbox.x, bbox.x + bbox.width)) &&
    (inRange(bbox.y, top, bottom) || inRange(bbox.y + bbox.height, top, bottom) || inRange(top, bbox.y, bbox.y + bbox.height)));
}

export const getIntersections = function (svg, referenceElement, areaInSvgCoordinate, areaInInitialSvgCoordinate) {
  return svg.getIntersectionList
    ? Array.prototype.slice.call(svg.getIntersectionList(areaInInitialSvgCoordinate, referenceElement))
    : collectElements([], svg, referenceElement || svg, function (element) { return intersects(areaInSvgCoordinate, element.getBBox()); });
}