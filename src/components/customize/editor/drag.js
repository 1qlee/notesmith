import { convertFloatFixed } from "../../../utils/helper-functions"
import * as d3 from "d3"
import { throttle } from "lodash"

function parseDragElements(nodes, event) {
  const eventX = convertFloatFixed(event.x, 3)
  const eventY = convertFloatFixed(event.y, 3)
  // handle various node types (shapes, lines, text, etc.)
  for (let i = 0, length = nodes.length; i < length; i++) {
    const currentNode = nodes[i]
    const node = d3.select(nodes[i])
    const isCircle = currentNode instanceof SVGCircleElement || currentNode instanceof SVGEllipseElement
    const isLine = currentNode instanceof SVGLineElement
    const isGroup = currentNode instanceof SVGGElement
    const isPath = currentNode instanceof SVGPathElement
    
    switch (true) {
      case isCircle:
        let circle = node
        let cx = convertFloatFixed((+circle.attr("cx")) + event.dx, 3)
        let cy = convertFloatFixed((+circle.attr("cy")) + event.dy, 3)

        node
          .attr("cx", cx)
          .attr("cy", cy)
        break
      case isLine:
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
      case isPath:
        let path = node
        let d = path.attr("d") // Get the current path data
        // Modify the path data to move the element
        // Example: Move the path by adding event.dx to the x-coordinate and event.dy to the y-coordinate
        let modifiedD = d.replace(/([MmLlHhVvCcSsQqTtAaZz])\s*([-+]?\d*\.?\d+)\s*([-+]?\d*\.?\d+)/g, (match, command, x, y) => {
          let newX = convertFloatFixed(parseFloat(x) + event.dx, 3)
          let newY = convertFloatFixed(parseFloat(y) + event.dy, 3)
          return `${command} ${newX} ${newY}`
        })

        node.attr("d", modifiedD) // Set the modified path data
        break
      case isGroup:
        parseDragElements(currentNode.childNodes, event)
        break
      default:
        node
          .attr("x", eventX)
          .attr("y", eventY)
        break
    }
  }
}

function drag(dispatch, coords) {
  function dragsubject(event) {

    const selectionPath = d3.select("#selection-path")

    if (!selectionPath.empty()) {
      return d3.selectAll("[data-selected]").nodes()
    }
    // // all the child nodes of the canvas page
    // const selectionPath = d3.select("#selection-path")
    // const { sourceEvent } = event
    // const coords = {
    //   x: sourceEvent.clientX,
    //   y: sourceEvent.clientY,
    // }

    // if (!selectionPath.empty()) {
    //   const pathBox = d3.select("#selection-path").node().getBoundingClientRect()
    //   const isMouseInSelection = detectMouseInSelection(coords, pathBox, 2)

    //   if (isMouseInSelection) {
    //     return d3.selectAll("[data-selected]").nodes()
    //   }
    // }
  }

  function dragstart(event, d) {
    console.log("drag start")
    const { subject } = event

    dispatch({
      type: "toggle",
      setting: "selecting",
      value: false,
    })

    // loop each child of #selection-group and remove data-selected
    for (let i = 0, length = subject.length; i < length; i++) {
      d3.select(subject[i]).attr("data-selected", null).raise()
    }
  }

  const dragged = throttle((event, d) => {
    dispatch({
      type: "change-mode",
      mode: "drag",
    })

    const { subject } = event

    parseDragElements(subject, event)

    dispatch({
      type: "parse-selection"
    })

    dispatch({
      type: "remove",
      setting: "selectionPath",
      value: "",
    })
  }, 0)
  
  function dragend(event, d) {
    console.log("drag end")
    const { subject } = event

    for (let i = 0, length = subject.length; i < length; i++) {
      d3.select(subject[i]).attr("data-selected", "")
    }

    dispatch({
      type: "change-mode",
      mode: "select",
    })

    dispatch({
      type: "toggle",
      setting: "selecting",
      value: false,
    })

    dispatch({
      type: "parse-selection"
    })
  }

  return d3.drag()
    .subject(dragsubject)
    .on("start", dragstart)
    .on("drag", dragged)
    .on("end", dragend)
}

export default drag