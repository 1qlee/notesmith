import { convertFloatFixed } from "../../../../utils/helper-functions"
import { SVG } from '@svgdotjs/svg.js'
import { throttle } from "lodash"

function parseDragElements(elements, coords) {
  // handle various node types (shapes, lines, text, etc.)
  elements.each(ele => {
    const node = ele.node
    const isCircle = node instanceof SVGCircleElement || node instanceof SVGEllipseElement
    const isLine = node instanceof SVGLineElement
    const isGroup = node instanceof SVGGElement
    const isPath = node instanceof SVGPathElement

    switch (true) {
      case isCircle:
        let circle = ele
        let cx = convertFloatFixed((+circle.attr("cx")) + coords.dx, 3)
        let cy = convertFloatFixed((+circle.attr("cy")) + coords.dy, 3)

        ele
          .attr("cx", cx)
          .attr("cy", cy)
        break
      case isLine:
        let line = ele
        let x1 = convertFloatFixed((+line.attr("x1")) + coords.dx, 3)
        let y1 = convertFloatFixed((+line.attr("y1")) + coords.dy, 3)
        let x2 = convertFloatFixed((+line.attr("x2")) + coords.dx, 3)
        let y2 = convertFloatFixed((+line.attr("y2")) + coords.dy, 3)

        ele
          .attr("x1", x1)
          .attr("x2", x2)
          .attr("y1", y1)
          .attr("y2", y2)
        break
      case isPath:
        let path = ele
        let d = path.attr("d") // Get the current path data
        // Modify the path data to move the element
        // Example: Move the path by adding coords.dx to the x-coordinate and coords.dy to the y-coordinate
        let modifiedD = d.replace(/([MmLlHhVvCcSsQqTtAaZz])\s*([-+]?\d*\.?\d+)\s*([-+]?\d*\.?\d+)/g, (match, command, x, y) => {
          let newX = convertFloatFixed(parseFloat(x) + coords.dx, 3)
          let newY = convertFloatFixed(parseFloat(y) + coords.dy, 3)
          return `${command} ${newX} ${newY}`
        })

        ele.attr("d", modifiedD) // Set the modified path data
        break
      case isGroup:
        parseDragElements(ele.children(), coords)
        break
      default:
        ele
          .attr("x", coords.x)
          .attr("y", coords.y)
        break
    }
  })
}

function drag(dispatch, canvas, ref) {
  let coords = {
    dx: 0,
    dy: 0,
  }

  function beforeDrag(e) {
    if (!SVG("#selection-path")) {
      console.log("Blocking drag")
      e.preventDefault()
    }
    else {
      console.log("Allowing drag")
      
      dispatch({
        type: "toggle",
        setting: "selecting",
        value: false,
      })
    }
  }
  
  function dragStart(e) {
    console.log("drag start")
    const { event } = e.detail

    coords = {
      dx: event.clientX,
      dy: event.clientY,
    }

    dispatch({
      type: "change-mode",
      mode: "drag",
    })
  }

  const dragMove = throttle((e) => {
    console.log("dragging")
    const { event } = e.detail
    const selectedElements = SVG(ref).find("[data-selected]")
    const dx = event.clientX - coords.dx
    const dy = event.clientY - coords.dy

    const displacement = {
      dx: dx,
      dy: dy,
    }

    parseDragElements(selectedElements, displacement)

    dispatch({
      type: "parse-selection"
    })

    dispatch({
      type: "remove",
      setting: "selectionPath",
      value: "",
    })

    coords.dx = event.clientX
    coords.dy = event.clientY
  }, 0)

  function dragEnd(e) {
    console.log("drag end")
    // const { subject } = event

    // for (let i = 0, length = subject.length; i < length; i++) {
    //   d3.select(subject[i]).attr("data-selected", "")
    // }

    dispatch({
      type: "parse-selection",
    })
  }

  return canvas.draggable()
    .on("beforedrag.namespace", e => beforeDrag(e))
    .on("dragstart.namespace", e => dragStart(e))
    .on("dragmove.namespace", e => dragMove(e))
    .on("dragend.namespace", e => dragEnd(e))
}

export default drag