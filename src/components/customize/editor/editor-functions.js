import { convertFloatFixed } from "../../../utils/helper-functions"

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

    // Adjust the bounding box to consider the stroke width.
    let adjustedLeft = rect.left - distance - convertedStrokeWidth
    let adjustedRight = rect.right + distance + convertedStrokeWidth
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

export {
  findClosestNode
}