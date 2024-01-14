import { convertFloatFixed } from "../../../utils/helper-functions"
import { SVG } from '@svgdotjs/svg.js'
import { convertToMM, consolidateMixedObjects, convertToPx, processStringNumbers } from "../../../utils/helper-functions"

// checks cursor location to see if it is within the path perimeter
const findEnclosedPoint = (node, coords, distance, stroke) => {
  // check if there is at least one enclosed point in the path.
  for (let i = 0, len = node.getTotalLength(); i <= len; i += 4 /* arbitrary */) {
    let { x, y } = node.getPointAtLength(i)

    // Create an object representing the space around the point
    const areaAroundPoint = {
      x1: x - distance - stroke,
      x2: x + distance + stroke,
      y1: y - distance - stroke,
      y2: y + distance + stroke,
    }
    const { x1, x2, y1, y2 } = areaAroundPoint

    // Check if the cursor is within `distance` of the point
    if (
      coords.x >= x1 &&
      coords.x <= x2 &&
      coords.y >= y1 &&
      coords.y <= y2
    ) {
      return node
    }
  }
  return false
}

const isMouseInFill = (node, coords, canvas) => {
  let isPointInFill = false;

  try {
    const pointObj = new DOMPoint(coords.x, coords.y);
    isPointInFill = node.isPointInFill(pointObj);
  } catch (e) {
    // Fallback for browsers that don't support DOMPoint as an argument
    const pointObj = canvas.createSVGPoint();
    pointObj.x = coords.x;
    pointObj.y = coords.y;
    isPointInFill = node.isPointInFill(pointObj);
  }
  
  return isPointInFill;
};

// finds the closest node to the current cursor position
// used primarily to find the closest node to the cursor when the user moves the mouse
const findClosestNode = (nodes, coords, distance, canvas, adjustedCoords) => {
  const nodesArray = Array.from(nodes).reverse()
  
  // Iterate through nodes and calculate the distance to each node.
  for (const node of nodesArray) {
    const domNode = node.node
    // don't return the hover-clone node ever
    if (node.attr("id") === "hover-clone") {
      continue
    }

    // calculate the targetable area for each node in the canvas
    // then detect if the mouse cursor is within that area
    let strokeWidth = node.attr("stroke-width")
    let convertedStrokeWidth = strokeWidth ? convertFloatFixed(strokeWidth / 2, 3) : 0
    let rect = node.rbox()
    const nodeIsNotLine = !(domNode instanceof SVGLineElement)

    // If the node is a group, check the last child node for a stroke width
    // this will create a better targetable area
    if (domNode instanceof SVGGElement) {
      const childNodes = node.children()
      const { length } = childNodes
      const lastNode = childNodes[length - 1]

      if (lastNode instanceof SVGLineElement) {
        convertedStrokeWidth = convertFloatFixed(lastNode.getAttribute("stroke-width") / 2, 3)
      }
    }

    if (domNode instanceof SVGPathElement) {
      // basically if the cursor is near the perimeter of the path
      if (findEnclosedPoint(domNode, adjustedCoords, distance, convertedStrokeWidth)) {
        return node
      }

      // otherwise, check if the cursor is inside the fill area of the path
      if (isMouseInFill(domNode, adjustedCoords, canvas)) {
        return node
      }
    }
    else if (domNode instanceof SVGLineElement) {
      // basically if the cursor is near the perimeter of the line
      if (findEnclosedPoint(domNode, adjustedCoords, distance, convertedStrokeWidth)) {
        return node
      }
    }
    else {
      let nodeBox = {
        left: nodeIsNotLine ? rect.x - convertedStrokeWidth : rect.x,
        right: nodeIsNotLine ? rect.x2 + convertedStrokeWidth : rect.x2,
        top: rect.y - convertedStrokeWidth,
        bottom: rect.y2 + convertedStrokeWidth,
      }

      const isMouseInSelection = detectMouseInSelection(coords, nodeBox, distance)

      if (isMouseInSelection) {
        return node
      }
    }
  }
}

const parseAttributes = (ele) => {
  const element = SVG(ele)
  const type = element.node.tagName
  const fill = element.attr("fill") || "none"
  const strokeOpacity = element.attr("stroke-opacity") || 1
  const fillOpacity = element.attr("fill-opacity") || 1
  const strokeWidth = convertToMM(element.attr("stroke-width")) || 0.088
  const stroke = element.attr("stroke") || (type !== "line" ? "none" : "#000")
  const strokeDasharray = element.attr("stroke-dasharray") !== undefined ? processStringNumbers(element.attr("stroke-dasharray"), convertToMM) : ""
  const strokeStyle = element.attr("strokeStyle") || "Solid"
  const nodeAttributes = {
    fill,
    fillOpacity,
    type,
    strokeOpacity,
    stroke,
    strokeWidth,
    strokeDasharray,
    strokeStyle,
  }

  return nodeAttributes
}

const getAttributes = (element) => {
  const attributes = {}
  const node = SVG(element)
  const nodeAttributes = node.attr()

  for (const key in nodeAttributes) {
    if (nodeAttributes.hasOwnProperty(key)) {
      const value = nodeAttributes[key];
      // Do something with the key-value pair
      if (!isNaN(value)) {
        attributes[key] = convertFloatFixed(value, 3)
      } else {
        attributes[key] = value
      }
    }
  }

  return attributes
}

const parseBbox = (element, path) => {
  const bbox = element.getBBox()
  const bboxX = convertFloatFixed(bbox.x, 3)
  const bboxY = convertFloatFixed(bbox.y, 3)
  const bboxWidth = convertFloatFixed(bbox.width, 3)
  const bboxHeight = convertFloatFixed(bbox.height, 3)
  let eleBbox = {}

  if (path) {
    // for selection path
    eleBbox = {
      x: bboxX,
      y: bboxY,
      x2: bboxX,
      y2: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }
  else {
    eleBbox = {
      x: bboxX,
      y: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }

  return eleBbox
}

const parseSelection = (elements) => {
  // coords for the selection path box
  let selectionPath = {
    x: Infinity,
    y: Infinity,
    x2: -Infinity,
    y2: -Infinity,
  }
  // selection bbox properties
  let selectionBbox = {}
  let selectionAttributes = {}
  let convertedSelectionBbox = {}
  let path = ""

  // for each selected element, get the bbox and attributes
  elements.forEach((ele, index) => {
    const attributes = getAttributes(ele)

    // get the attribute values of the element
    let nodeAttributes = parseAttributes(ele)
    // get the bbox of the element
    const strokeOffset = convertToPx(nodeAttributes.strokeWidth / 2)
    // for selection path
    let eleBbox = parseBbox(ele, true)
    // for positioning attributes
    let positioningBbox = parseBbox(ele, false)
    const isCircle = ele instanceof SVGCircleElement || ele instanceof SVGEllipseElement
    const isLine = ele instanceof SVGLineElement
    const isPath = ele instanceof SVGPathElement

    // adjust selection bbox values for different svg elements
    switch (true) {
      case isCircle:
        positioningBbox.x = attributes.cx
        positioningBbox.y = attributes.cy
        eleBbox.x = convertFloatFixed(eleBbox.x - strokeOffset, 3)
        eleBbox.y = convertFloatFixed(eleBbox.y - strokeOffset, 3)
        eleBbox.x2 = convertFloatFixed(eleBbox.x2 + strokeOffset, 3)
        eleBbox.y2 = convertFloatFixed(eleBbox.y2 + strokeOffset, 3)
        break
      case isLine:
        // const { x1, x2, y1, y2 } = attributes

        // if there is only one line element selected and it is diagonal
        // give it a different selection path
        // if (elements.length === 1 && (y1 !== y2)) {
        //   path = createPath({ x: x1, y: y1 }, { x: x2, y: y2 })
        // }
        eleBbox.y = convertFloatFixed(eleBbox.y - strokeOffset, 3)
        eleBbox.y2 = convertFloatFixed(eleBbox.y2 + strokeOffset, 3)
        break
      case isPath:
        eleBbox.x = convertFloatFixed(eleBbox.x - strokeOffset, 3)
        eleBbox.y = convertFloatFixed(eleBbox.y - strokeOffset, 3)
        eleBbox.x2 = convertFloatFixed(eleBbox.x2 + strokeOffset, 3)
        eleBbox.y2 = convertFloatFixed(eleBbox.y2 + strokeOffset, 3)
        break
    }

    // set initial coords using the first element
    if (index === 0) {
      selectionBbox = positioningBbox
      selectionAttributes = nodeAttributes
    }

    // function to create bbox object for client
    selectionBbox = consolidateMixedObjects(positioningBbox, selectionBbox)
    // function to create attributes object for client
    selectionAttributes = consolidateMixedObjects(nodeAttributes, selectionAttributes)

    // create coords for the selection path
    selectionPath.x = Math.min(selectionPath.x, eleBbox.x)
    selectionPath.y = Math.min(selectionPath.y, eleBbox.y)
    selectionPath.x2 = Math.max(selectionPath.x2, convertFloatFixed(eleBbox.x2 + eleBbox.width, 3))
    selectionPath.y2 = Math.max(selectionPath.y2, convertFloatFixed(eleBbox.y2 + eleBbox.height, 3))
  })

  // create the selection path based on coords
  // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
  if (!path) {
    path = `M ${selectionPath.x},${selectionPath.y} L ${selectionPath.x2},${selectionPath.y} ${selectionPath.x2},${selectionPath.y2} ${selectionPath.x},${selectionPath.y2} Z`
  }

  convertedSelectionBbox = {
    x: typeof selectionBbox.x === "number" ? convertToMM(selectionBbox.x) : selectionBbox.x,
    y: typeof selectionBbox.y === "number" ? convertToMM(selectionBbox.y) : selectionBbox.y,
    width: typeof selectionBbox.width === "number" ? convertToMM(selectionBbox.width) : selectionBbox.width,
    height: typeof selectionBbox.height === "number" ? convertToMM(selectionBbox.height) : selectionBbox.height,
  }

  return {
    selectionBbox: convertedSelectionBbox,
    selectionAttributes: selectionAttributes,
    selectionPath: path,
    selectionGroup: selectionPath,
  }
}

function findNodeInSelection(array, propertyName, node) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][propertyName].isSameNode(node)) {
      return i; // Return the index of the element if found.
    }
  }
  return -1; // Return -1 if the element is not found.
}

const detectMouseInSelection = (coords, box, distance) => {
  let { x, y } = coords
  let { left, top, right, bottom } = box

  let adjustedLeft = left - distance
  let adjustedRight = right + distance
  let adjustedTop = top - distance 
  let adjustedBottom = bottom + distance 

  // Check if the cursor is within the adjusted bounding box.
  if (
    x >= adjustedLeft &&
    x <= adjustedRight &&
    y >= adjustedTop &&
    y <= adjustedBottom
  ) {
    // Mouse is within the element's bounds
    return true
  } else {
    // Mouse is outside the element's bounds
    return false
  }
}

export {
  findClosestNode,
  findEnclosedPoint,
  findNodeInSelection,
  getAttributes,
  parseBbox,
  parseSelection,
  detectMouseInSelection,
}