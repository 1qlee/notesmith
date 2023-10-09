import { convertFloatFixed } from "../../../utils/helper-functions"
import * as d3 from "d3"
import { convertToMM, consolidateMixedObjects, convertToPx, processStringNumbers } from "../../../utils/helper-functions"

const findClosestNode = (nodes, coords, distance) => {
  const mouseX = coords.clientX
  const mouseY = coords.clientY
  let closestNode = null

  // Iterate through nodes and calculate the distance to each node.
  for (const node of nodes) {
    // calculate the targetable area for each node in the canvas
    // then detect if the mouse cursor is within that area
    let strokeWidth = node.getAttribute("stroke-width")
    let convertedStrokeWidth = strokeWidth ? convertFloatFixed(strokeWidth / 2, 3) : 0
    let rect = node.getBoundingClientRect()

    // If the node is a group, check the last child node for a stroke width
    // this will create a better targetable area
    if (node instanceof SVGGElement) {
      const { childNodes } = node
      const { length } = childNodes
      const lastNode = childNodes[length - 1]

      if (lastNode instanceof SVGLineElement) {
        convertedStrokeWidth = convertFloatFixed(lastNode.getAttribute("stroke-width") / 2, 3)
      }
    }

    // Adjust the bounding box to consider the stroke width as well as distance
    // distance is the amount of pixels (leeway) to add to the bounding box
    let adjustedLeft = rect.left - distance
    let adjustedRight = rect.right + distance
    let adjustedTop = rect.top - distance - convertedStrokeWidth
    let adjustedBottom = rect.bottom + distance + convertedStrokeWidth

    // Check if the cursor is within the adjusted bounding box.
    if (
      mouseX >= adjustedLeft &&
      mouseX <= adjustedRight &&
      mouseY >= adjustedTop &&
      mouseY <= adjustedBottom
    ) {
      closestNode = node
      break // Break early if a valid subject is found.
    }
  }

  // Return the closest node as the subject.
  return closestNode
}

const parseAttributes = (element) => {
  const fill = element.attr("fill") || "none"
  const stroke = element.attr("stroke") || "none"
  const strokeOpacity = element.attr("stroke-opacity") || 1
  const fillOpacity = element.attr("fill-opacity") || 1
  const strokeWidth = convertToMM(element.attr("stroke-width")) || 0.088
  const strokeDasharray = element.attr("stroke-dasharray") !== undefined ? processStringNumbers(element.attr("stroke-dasharray"), convertToMM) : ""
  const strokeStyle = element.attr("strokeStyle") || "Solid"
  const nodeAttributes = {
    fill,
    fillOpacity,
    strokeOpacity,
    stroke,
    strokeWidth,
    strokeDasharray,
    strokeStyle,
  }

  return nodeAttributes
}

const parseBbox = (element, path) => {
  const bbox = element.getBBox()
  const bboxX = convertFloatFixed(bbox.x, 3)
  const bboxY = convertFloatFixed(bbox.y, 3)
  const bboxWidth = convertFloatFixed(bbox.width, 3)
  const bboxHeight = convertFloatFixed(bbox.height, 3)
  let pathBbox = {}

  if (path) {
    // for selection path
    pathBbox = {
      x: bboxX,
      y: bboxY,
      x2: bboxX,
      y2: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }
  else {
    pathBbox = {
      x: bboxX,
      y: bboxY,
      width: bboxWidth,
      height: bboxHeight,
    }
  }

  return pathBbox
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

  // for each selected element, get the bbox and attributes
  elements.forEach((ele, index) => {
    const element = d3.select(ele)

    // get the attribute values of the element
    let nodeAttributes = parseAttributes(element)
    // get the bbox of the element
    const strokeOffset = convertToPx(nodeAttributes.strokeWidth / 2)
    // for selection path
    let pathBbox = parseBbox(ele, true)
    // for positioning attributes
    let positioningBbox = parseBbox(ele, false)
    const isCircle = ele instanceof SVGCircleElement || ele instanceof SVGEllipseElement
    const isLine = ele instanceof SVGLineElement

    // adjust selection bbox values for different svg elements
    switch (true) {
      case isCircle:
        positioningBbox.x = convertFloatFixed(element.attr("cx"), 3)
        positioningBbox.y = convertFloatFixed(element.attr("cy"), 3)
        pathBbox.x = convertFloatFixed(pathBbox.x - strokeOffset, 3)
        pathBbox.y = convertFloatFixed(pathBbox.y - strokeOffset, 3)
        pathBbox.x2 = convertFloatFixed(pathBbox.x2 + strokeOffset, 3)
        pathBbox.y2 = convertFloatFixed(pathBbox.y2 + strokeOffset, 3)
        break
      case isLine:
        pathBbox.y = convertFloatFixed(pathBbox.y - strokeOffset, 3)
        pathBbox.y2 = convertFloatFixed(pathBbox.y2 + strokeOffset, 3)
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
    selectionPath.x = Math.min(selectionPath.x, pathBbox.x)
    selectionPath.y = Math.min(selectionPath.y, pathBbox.y)
    selectionPath.x2 = Math.max(selectionPath.x2, convertFloatFixed(pathBbox.x2 + pathBbox.width, 3))
    selectionPath.y2 = Math.max(selectionPath.y2, convertFloatFixed(pathBbox.y2 + pathBbox.height, 3))
  })

  // create the selection path based on coords
  // coords are top-left (x,y), top-right (x2,y), bottom-right (x2,y2), bottom-left (x,y2)
  const path = `M ${selectionPath.x},${selectionPath.y} L ${selectionPath.x2},${selectionPath.y} ${selectionPath.x2},${selectionPath.y2} ${selectionPath.x},${selectionPath.y2} Z`

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
    console.log(array[i][propertyName])
    if (array[i][propertyName].isSameNode(node)) {
      return i; // Return the index of the element if found.
    }
  }
  return -1; // Return -1 if the element is not found.
}

const detectMouseInSelection = (coords, box) => {
  let { clientX, clientY } = coords
  let { left, top, right, bottom } = box
  const distance = 3

  let adjustedLeft = left - distance
  let adjustedRight = right + distance
  let adjustedTop = top - distance 
  let adjustedBottom = bottom + distance 

  // Check if the cursor is within the adjusted bounding box.
  if (
    clientX >= adjustedLeft &&
    clientX <= adjustedRight &&
    clientY >= adjustedTop &&
    clientY <= adjustedBottom
  ) {
    console.log("inside")
    // Mouse is within the element's bounds
    return true
  } else {
    // Mouse is outside the element's bounds
    return false
  }

}

export {
  findClosestNode,
  findNodeInSelection,
  parseBbox,
  parseSelection,
  detectMouseInSelection,
}