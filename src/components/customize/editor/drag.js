import { convertFloatFixed } from "../../../utils/helper-functions"
import * as d3 from "d3"
import { throttle } from "lodash"
import { findClosestNode } from "./editor-functions"

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
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
      break
    default:
      node
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

  // // all elements inside #selection-group <g>
  // const childNodes = d3.select(this).selectAll("*")._groups[0]

  // for (let i = 0; i < childNodes.length; i++) {
  //   const childNode = childNodes[i];
  //   const node = d3.select(childNode)
  //   const nodeName = childNode.nodeName
  //   // 'childNode' is the actual child DOM element
  //   parseDragElements(node, nodeName, event)
  // }
}

function drag(referenceElement, dispatch, canvasState) {
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
    // all the child nodes of the canvas page
    const nodes = d3.select(referenceElement).selectAll("*")._groups[0]
    const { sourceEvent } = event

    return findClosestNode(nodes, sourceEvent, 3)
  }

  function dragstart(event, d) {
    console.log("drag start")
    const { subject } = event

    d3.select(subject).attr("data-selecting", null)
  }

  const draggedMulti = throttle((event, d) => {
    console.log("dragging multi")
    
  }, 0)

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

    dispatch({
      type: "remove",
      setting: "selectionPath",
      value: "",
    })
  }, 0)
  
  function dragend(event, d) {
    console.log("drag end")
    
    const { subject } = event

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