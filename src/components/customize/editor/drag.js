import { convertFloatFixed } from "../../../utils/helper-functions"
import * as d3 from "d3"
import { throttle } from "lodash"

function parseDragElements(node, nodeName, event) {
  const eventX = convertFloatFixed(event.x, 3)
  const eventY = convertFloatFixed(event.y, 3)
  // handle various node types (shapes, lines, text, etc.)
  switch (nodeName) {
    case "circle":
    case "ellipse":
      let circle = node
      let cx = convertFloatFixed((+circle.attr("cx")) + event.dx, 3)
      let cy = convertFloatFixed((+circle.attr("cy")) + event.dy, 3)

      node
        .raise()
        .attr("cx", cx)
        .attr("cy", cy)
      break
    case "line":
      let line = node
      let x1 = convertFloatFixed((+line.attr("x1")) + event.dx, 3)
      let y1 = convertFloatFixed((+line.attr("y1")) + event.dy, 3)
      let x2 = convertFloatFixed((+line.attr("x2")) + event.dx, 3)
      let y2 = convertFloatFixed((+line.attr("y2")) + event.dy, 3)

      node
        .raise()
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
      break
    default:
      node
        .raise()
        .attr("x", eventX)
        .attr("y", eventY)
      break
  }
}

function draggedMulti(event, d) {
  console.log("dragging multi")

  // change mode to drag if it is not already
  // if (canvasState.mode !== "drag") {
  //   dispatch({
  //     type: "change-mode",
  //     mode: "drag",
  //   })
  // }

  // // all elements inside #selected-elements <g>
  // const childNodes = d3.select(this).selectAll("*")._groups[0]

  // for (let i = 0; i < childNodes.length; i++) {
  //   const childNode = childNodes[i];
  //   const node = d3.select(childNode)
  //   const nodeName = childNode.nodeName
  //   // 'childNode' is the actual child DOM element
  //   parseDragElements(node, nodeName, event)
  // }
}

function drag(nodes, dispatch) {
  function parseDragSubject(node, nodeName, event) {
    const subject = d3.select(node)
    // handle various node types (shapes, lines, text, etc.)
    switch (nodeName) {
      case "circle":
      case "ellipse":
        return {
          node: node,
          x: +subject.attr("cx"),
          y: +subject.attr("cy"),
        }
      case "line":
        return {
          node: node,
          x: +subject.attr("x1"),
          y: +subject.attr("y1"),
        }
      default:
        return {
          node: node,
          x: +subject.attr("x"),
          y: +subject.attr("y"),
        }
    }
  }

  function dragsubject(event) {
    console.log("🚀 ~ file: drag.js:98 ~ dragsubject ~ event:", event)
    const mouseX = event.sourceEvent.clientX
    const mouseY = event.sourceEvent.clientY
    let closestNode = null;
    let distance = 3;

    // Iterate through nodes and calculate the distance to each node.
    for (const node of nodes) {
      if (node.nodeName === "g") {
        console.log(node)
      }
      const strokeWidth = node.getAttribute("stroke-width")
      const adjustedStrokeWidth = strokeWidth ? convertFloatFixed(strokeWidth / 2, 3) : 0
      const rect = node.getBoundingClientRect()

      // Adjust the bounding box to consider the stroke width.
      const adjustedLeft = rect.left - distance - adjustedStrokeWidth
      const adjustedRight = rect.right + distance + adjustedStrokeWidth
      const adjustedTop = rect.top - distance - adjustedStrokeWidth
      const adjustedBottom = rect.bottom + distance + adjustedStrokeWidth

      // Check if the cursor is within the adjusted bounding box.
      if (
        mouseX >= adjustedLeft &&
        mouseX <= adjustedRight &&
        mouseY >= adjustedTop &&
        mouseY <= adjustedBottom
      ) {
        closestNode = node;
        break; // Break early if a valid subject is found.
      }
    }

    // Return the closest node as the subject.
    return closestNode;
  }

  function dragstart(event, d) {
    console.log("drag start")
    const { subject } = event
  }

  const dragged = throttle((event, d) => {
    console.log("draggin")
    dispatch({
      type: "change-mode",
      mode: "drag",
    })
    const { subject } = event
    const { nodeName } = subject
    const node = d3.select(subject)

    parseDragElements(node, nodeName, event)
  }, 0)
  
  function dragend(event, d) {
    console.log("drag end")

    dispatch({
      type: "change-mode",
      mode: "select",
    })
  }

  return d3.drag()
    .subject(dragsubject)
    .on("start", dragstart)
    .on("drag", dragged)
    .on("end", dragend)
}

export default drag