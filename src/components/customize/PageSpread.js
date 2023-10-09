import React, { useEffect, useState, useRef } from "react"
import { convertToPx, convertFloatFixed } from "../../utils/helper-functions"
import { pageMargins, colors } from "../../styles/variables"
import { throttle } from "lodash"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import { findClosestNode, detectMouseInSelection } from "./editor/editor-functions"
import * as d3 from "d3"
import drag from "./editor/drag"
import dragSelector from "./editor/drag-selector"

import CoverPage from "./pageComponents/CoverPage"
import Selection from "./Selection"
import CanvasPage from "./editor/CanvasPage"

const minimumMargin = pageMargins.minimum
const holesMargin = pageMargins.holes

function PageSpread({
  bookData,
  canvasPages,
  canvasPageTemplates,
  canvasSize,
  pageData,
  selectedPage,
  selectedPageSvg,
  setMax,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  svgSize,
}) {
  const canvasRef = useRef(null)
  const canvasPageRef = useRef(null)
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const [svgLoaded, setSvgLoaded] = useState(false)
  const [hoverClone, setHoverClone] = useState(undefined)
  const { svgWidth, svgHeight, marginTop, marginRight, marginBottom, marginLeft } = pageData
  const pageIsLeft = selectedPage % 2 === 0
  const spreadPosition = {
    x: (canvasSize.width - svgWidth * 2) / 2,
    y: (canvasSize.height - svgHeight) / 2,
  }
  let currentPageSide = "right"
  let leftPage = null
  let rightPage = null

  if (pageIsLeft) {
    // set page side in state
    currentPageSide = "left"

    // if it's the last page, show only the left page
    if (selectedPage === bookData.numOfPages) {
      leftPage = (canvasPages[selectedPage - 1].pageId)
      rightPage = (null)
    }
    // otherwise show the 2-page spread
    else {
      leftPage = (canvasPages[selectedPage - 1].pageId)
      rightPage = (canvasPages[selectedPage].pageId)
    }
  }
  // odd pages
  else {
    // set page side in state
    currentPageSide = "right"

    // if it's the first page, show only the right page
    if (selectedPage === 1) {
      rightPage = (canvasPages[selectedPage - 1].pageId)
      leftPage = (null)
    }
    // otherwise show the 2-page spread
    else {
      leftPage = (canvasPages[selectedPage - 2].pageId)
      rightPage = (canvasPages[selectedPage - 1].pageId)
    }
  }

  const leftPageTemplate = canvasPageTemplates[leftPage]
  const rightPageTemplate = canvasPageTemplates[rightPage]
  let templateMargins = {
    top: convertToPx(marginTop),
    right: convertToPx(marginRight),
    bottom: convertToPx(marginBottom),
    left: convertToPx(marginLeft),
  }
  const leftPageMargins = selectedPage !== 1 && {
    top: convertToPx(leftPageTemplate.marginTop),
    right: convertToPx(leftPageTemplate.marginRight),
    bottom: convertToPx(leftPageTemplate.marginBottom),
    left: convertToPx(leftPageTemplate.marginLeft),
  }
  const rightPageMargins = selectedPage !== bookData.numOfPages && {
    top: convertToPx(rightPageTemplate.marginTop),
    right: convertToPx(rightPageTemplate.marginRight),
    bottom: convertToPx(rightPageTemplate.marginBottom),
    left: convertToPx(rightPageTemplate.marginLeft),
  }
  let pagePosition = pageData.template ? {
    x: pageIsLeft ? minimumMargin + templateMargins.left : svgWidth + holesMargin + templateMargins.left,
    y: minimumMargin + templateMargins.top,
  } : {
    x: pageIsLeft ? minimumMargin + leftPageMargins.left : svgWidth + holesMargin + rightPageMargins.left,
    y: pageIsLeft ? minimumMargin + leftPageMargins.top : minimumMargin + rightPageMargins.top,
  }

  // custom selector function
  const makeSelections = ({
    svg,
    referenceElement,
    pointerEvent, // listens to click and drag events
    dragAreaInClientCoordinate,
    dragAreaInSvgCoordinate, // bbox of the selection rectangle relative to the svg canvas
    dragAreaInInitialSvgCoordinate,
  }) => {
    const svgDragSelectElementTypes = [SVGCircleElement, SVGEllipseElement, SVGImageElement, SVGLineElement, SVGPathElement, SVGPolygonElement, SVGPolylineElement, SVGRectElement, SVGTextElement, SVGUseElement, SVGGElement]

    const collectElements = function (into, svg, ancestor, filter) {
      for (let element = ancestor.firstElementChild; element; element = element.nextElementSibling) {
        for (let _i = 0, svgDragSelectElementTypes_1 = svgDragSelectElementTypes; _i < svgDragSelectElementTypes_1.length; _i++) {
          let elementType = svgDragSelectElementTypes_1[_i];
          if (element instanceof elementType && filter(element)) {
            into.push(element)
          }
        }
      }

      return into;
    };

    // Updated intersects function to check cursor distance.
    const intersects = function (areaInSvgCoordinate, element) {
      if (element.getAttribute("id") === "hover-clone") {
        return false
      }

      let bbox = element.getBBox()
      let convertedStrokeWidth = 0

      // If the element is a line, check the last child node for a stroke width
      if (element instanceof SVGLineElement) {
        convertedStrokeWidth = convertFloatFixed(element.getAttribute("stroke-width") / 2, 3)
      }

      // bbox for the selection box/rect
      let rectX = areaInSvgCoordinate.x
      let rectY = areaInSvgCoordinate.y
      let rectWidth = areaInSvgCoordinate.width
      let rectHeight = areaInSvgCoordinate.height

      if (pageIsLeft) {
        rectX -= 12
        rectY -= 12
      }
      else {
        rectX -= (svgWidth + holesMargin)
        rectY -= 12
      }

      if (
        bbox.x + bbox.width + 3 >= rectX &&
        bbox.x - 3 <= rectX + rectWidth &&
        bbox.y + bbox.height + 3 + convertedStrokeWidth >= rectY &&
        bbox.y - 3 - convertedStrokeWidth <= rectY + rectHeight
      ) {
        return true
      }
    }

    // function expandSVGRect(rect, margin) {
    //   console.log("yo")
    //   // Create a new SVGRect object using createSVGRect.
    //   rect.x = rect.x - margin
    //   rect.y = rect.y - margin
    //   rect.width = rect.width + 2 * margin
    //   rect.height = rect.height + 2 * margin

    //   return rect
    // }

    var getIntersections = function (svg, referenceElement, areaInSvgCoordinate, areaInInitialSvgCoordinate) {
      return collectElements([], svg, referenceElement || svg, function (element) {
        return intersects(areaInSvgCoordinate, element)
      })
    };

    // returns an array of selected elements
    // const getIntersections = function (svg, referenceElement, areaInSvgCoordinate, areaInInitialSvgCoordinate) {
    //   const ref = referenceElement || svg
    //   const nodes = d3.select(ref).selectChildren()
    //   let selectedElements = []

    //   for (const node of nodes) {
    //     // skip selection group <g> element
    //     if (node.getAttribute("id") === "selection-group") {
    //       getIntersections(node, node, areaInSvgCoordinate, areaInInitialSvgCoordinate)
    //       continue
    //     }

    //     let bbox = node.getBBox()
    //     let convertedStrokeWidth = 0

    //     // If the element is a line, check the last child node for a stroke width
    //     if (node instanceof SVGLineElement) {
    //       convertedStrokeWidth = convertFloatFixed(node.getAttribute("stroke-width") / 2, 3)
    //     }

    //     // bbox for the selection box/rect
    //     let rectX = areaInSvgCoordinate.x
    //     let rectY = areaInSvgCoordinate.y
    //     let rectWidth = areaInSvgCoordinate.width
    //     let rectHeight = areaInSvgCoordinate.height

    //     if (pageIsLeft) {
    //       rectX -= 12
    //       rectY -= 12
    //     }
    //     else {
    //       rectX -= (svgWidth + holesMargin)
    //       rectY -= 12
    //     }

    //     if (
    //       bbox.x + bbox.width + 3 >= rectX &&
    //       bbox.x - 3 <= rectX + rectWidth &&
    //       bbox.y + bbox.height + 3 + convertedStrokeWidth >= rectY &&
    //       bbox.y - 3 - convertedStrokeWidth <= rectY + rectHeight
    //     ) {
    //       selectedElements.push(node)
    //     }
    //   }


    //   return selectedElements
    // }

    return getIntersections(
      svg,
      referenceElement,
      dragAreaInSvgCoordinate,
      dragAreaInInitialSvgCoordinate,
    ).filter(element => {
      // the element that the pointer event raised is considered to intersect.
      if (pointerEvent.target === element) {
        return true
      }
      // strictly check only <path>s.
      if (!(element instanceof SVGPathElement)) {
        return true
      }

      // check if there is at least one enclosed point in the path.
      for (let i = 0, len = element.getTotalLength(); i <= len; i += 4 /* arbitrary */) {
        let { x, y } = element.getPointAtLength(i)

        let dragCoords = {
          x: dragAreaInSvgCoordinate.x - 12,
          y: dragAreaInSvgCoordinate.y - 12,
        }
        if (pageData.template) {
          dragCoords.x = dragCoords.x - templateMargins.left
          dragCoords.y = dragCoords.y - templateMargins.top
        }
        else {
          if (pageIsLeft) {
            dragCoords.x = dragCoords.x - leftPageMargins.left
            dragCoords.y = dragCoords.y - leftPageMargins.top
          }
          else {
            dragCoords.x = dragCoords.x - rightPageMargins.left
            dragCoords.y = dragCoords.y - rightPageMargins.top
          }
        }

        if (!pageIsLeft) {
          dragCoords.x = dragCoords.x - svgWidth - holesMargin + 12
        }

        if (
          dragCoords.x <= x && x <= dragCoords.x + dragAreaInSvgCoordinate.width &&
          dragCoords.y <= y && y <= dragCoords.y + dragAreaInSvgCoordinate.height
        ) {
          return true
        }
      }
      return false
    })
  }

  // give hover "effect" to elements to aid with selection
  const handleMouseMove = throttle(e => {
    if (!canvasState.selecting) {
      let coords = {
        clientX: e.clientX,
        clientY: e.clientY,
      }
      const selectionPath = d3.select("#selection-path")
      
      if (!selectionPath.empty()) {
        const pathBox = selectionPath.node().getBoundingClientRect()
        const isMouseInSelection = detectMouseInSelection(coords, pathBox)

        if (isMouseInSelection) {
          return dispatch({
            type: "change-mode",
            mode: "drag",
          })
        }
      }

      let subject = null
      let nodes = d3.select(canvasPageRef.current).selectChildren()

      if (nodes) {
        subject = findClosestNode(nodes, coords, 3)
      }

      // create a hover-clone element which sits on top of the hovered element
      // creating an illusion of hovered effect (blue border effect)
      if (canvasPageRef.current && canvasPageRef.current.contains(subject)) {
        const node = d3.select(subject)

        // don't work with hover clone node
        if (node.attr("id") === "hover-clone" || node.attr("[data-selected]")) return

        // if the node is not our cloned hover node, create one
        // we only create these for single node selections
        // look for nodes that are not selected or is a selection group
        if (node.attr("data-selected") === null) {
          d3.selectAll("[data-hovered]").attr("data-hovered", null)

          // exit if we are hovering the same node
          if (hoverClone && hoverClone.isSameNode(subject)) {
            return
          }

          // remove existing hover clone node
          d3.select("#hover-clone").remove()

          // slightly thicker stroke width so it shows over the original
          const nodeStrokeWidth = Number(node.style("stroke-width").slice(0, -2)) + 1

          // if the node is a group, add an invisible rectangle to the cloned node
          if (node.node() instanceof SVGGElement) {
            const nodeBBox = node.node().getBBox()
            d3.select(canvasPageRef.current).append("rect")
              .raise()
              .attr("id", "hover-clone")
              .attr("stroke-width", nodeStrokeWidth)
              .attr("stroke", colors.blue.sixHundred)
              .attr("width", convertFloatFixed(nodeBBox.width, 3))
              .attr("height", convertFloatFixed(nodeBBox.height, 3))
              .attr("fill", "transparent")
              .style("transform", `translate(${nodeBBox.x}px, ${nodeBBox.y}px)`)
              .style("pointer-events", "none")

            setHoverClone(subject)
          }
          else {
            node.clone()
              .raise()
              .attr("id", "hover-clone")
              .attr("stroke-width", nodeStrokeWidth)
              .attr("fill", "transparent")
              .attr("stroke", colors.blue.sixHundred)
              .style("pointer-events", "none")

            setHoverClone(subject)
          }
        }
      }
      else {
        dispatch({
          type: "change-mode",
          mode: "select",
        })

        setHoverClone(null)
        d3.selectAll("[data-hovered]").attr("data-hovered", null)
        d3.select("#hover-clone").remove()
      }
    }
  }, 10)

  const handleMouseClick = (e) => {
    console.log("Click")
  }

  useEffect(() => {
    let referenceElement = null
    // this is how we know we have the canvas page loaded
    const isCanvasPage = svgLoaded === selectedPage ? true : false

    if (isCanvasPage) {
      referenceElement = canvasPageRef.current
      pagePosition = {
        x: pageIsLeft ? minimumMargin + leftPageMargins.left : svgWidth + holesMargin + rightPageMargins.left,
        y: pageIsLeft ? minimumMargin + leftPageMargins.top : minimumMargin + rightPageMargins.top,
      }
    }

    dispatch({
      type: "initialize",
      canvas: referenceElement,
    })

    if (canvasState.mode === "select" && referenceElement) {
      let coords = {
        clientX: 0,
        clientY: 0,
      }

      const {
        cancel,           // cleanup function.
        // please call `cancel()` when the select-on-drag behavior is no longer needed.
        dragAreaOverlay,  // a div element overlaying dragging area.
        // you can customize the style of this element.
        // this element has "svg-drag-select-area-overlay" class by default.
      } = dragSelector({
        // the svg element (required).
        svg: canvasRef.current,
        // followings are optional parameters with default values.
        referenceElement: referenceElement,     // selects only descendants of this SVGElement if specified.
        selector: makeSelections,      // "enclosure": selects enclosed elements using getEnclosureList().
        // "intersection": selects intersected elements using getIntersectionList().
        // function: custom selector implementation

        // followings are optional selection handlers
        onSelectionStart({
          svg,                      // the svg element.
          pointerEvent,             // a `PointerEvent` instance with "pointerdown" type.
          // (in case of Safari, a `MouseEvent` or a `TouchEvent` is used instead.)
          cancel,                   // cancel() cancels.
        }) {
          // for example: handles mouse left button only.
          if (pointerEvent.button !== 0) {
            cancel()
            return
          }

          coords = {
            clientX: pointerEvent.clientX,
            clientY: pointerEvent.clientY,
          }

          dispatch({
            type: "ungroup-selection",
          })

          dispatch({
            type: "toggle",
            setting: "selecting",
            value: true,
          })
        },

        onSelectionChange({
          svg,                      // the svg element.
          pointerEvent,             // a `PointerEvent` instance with either a "pointerdown" event or a "pointermove" event.
          // (in case of Safari, a `MouseEvent` or a `TouchEvent` is used instead.)
          selectedElements,         // selected element array.
          previousSelectedElements, // previous selected element array.
          newlySelectedElements,    // `selectedElements - previousSelectedElements`
          newlyDeselectedElements,  // `previousSelectedElements - selectedElements`
        }) {
          coords.clientX = pointerEvent.clientX
          coords.clientY = pointerEvent.clientY
          // calculate if the current clientX and clientY are greater than previous in `coords`
          // if so, we are moving right/down, otherwise we are moving left/up
          const isDescending = pointerEvent.clientX > coords.clientX && pointerEvent.clientY > coords.clientY
          const isAscending = pointerEvent.clientX < coords.clientX && pointerEvent.clientY < coords.clientY
          const numOfElements = selectedElements.length

          dispatch({
            type: "change-selection",
            selectedElements: selectedElements,
            newlySelectedElements: newlySelectedElements,
            newlyDeselectedElements: newlyDeselectedElements,
          })
        },

        onSelectionEnd({
          svg,                      // the svg element.
          pointerEvent,             // a `PointerEvent` instance with either a "pointerup" event or a "pointercancel" event.
          // (in case of Safari, a `MouseEvent` or a `TouchEvent` is used instead.)
          selectedElements,         // selected element array.
        }) {
          dispatch({
            type: "toggle",
            setting: "selecting",
            value: false,
          })
        }
      })

      if (canvasRef.current && referenceElement) {
        d3.select(canvasRef.current)
          .call(drag(referenceElement, dispatch, canvasState, coords))
      }

      return () => {
        cancel()
      }
    }
  }, [canvasState.mode, canvasState.canvas, canvasPageRef, svgLoaded, selectedPage])

  return (
    <svg
      id="page-spread"
      ref={canvasRef}
      xmlns="http://www.w3.org/2000/svg"
      height={svgHeight + 2}
      width={svgWidth * 2 + 3}
      x={spreadPosition.x}
      y={spreadPosition.y}
      onMouseMove={e => handleMouseMove(e)}
      onClick={e => handleMouseClick(e)}
    >
      <CoverPage
        bookData={bookData}
        selectedPage={selectedPage}
        pageHeight={svgHeight}
        pageWidth={svgWidth}
      />
      <CanvasPage
        bookData={bookData}
        canvasPageRef={canvasPageRef}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "left" ? true : false}
        margins={leftPageMargins}
        pageData={pageData}
        pageId={leftPage}
        pagePosition={pagePosition}
        pageSide="left"
        pageTemplate={leftPageTemplate}
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        setSvgSize={setSvgSize}
        svgSize={svgSize}
      />
      <CanvasPage
        bookData={bookData}
        canvasPageRef={canvasPageRef}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        margins={rightPageMargins}
        pageData={pageData}
        pageId={rightPage}
        pagePosition={pagePosition}
        pageSide="right"
        pageTemplate={rightPageTemplate}
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
        setSvgLoaded={setSvgLoaded}
        svgSize={svgSize}
      />
      {canvasState.selectedElements.length > 0 && canvasState.selectionPath && (
        <Selection
          position={pagePosition}
          path={canvasState.selectionPath}
        />
      )}
    </svg>
  )
}

export default PageSpread