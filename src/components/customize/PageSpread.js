import React, { useEffect, useState, useRef } from "react"
import { convertToPx, convertFloatFixed } from "../../utils/helper-functions"
import { pageMargins, colors } from "../../styles/variables"
import { throttle } from "lodash"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import { findClosestNode, detectMouseInSelection, getAttributes } from "./editor/editor-functions"
import * as d3 from "d3"
import drag from "./editor/drag"
import dragSelector from "./editor/drag-selector"

import CoverPage from "./pageComponents/CoverPage"
import Selection from "./Selection"
import CanvasPage from "./editor/CanvasPage"

const minimumMargin = pageMargins.minimum
const holesMargin = pageMargins.holes

function PageSpread({
  canvasPageTemplates,
  canvasPages,
  canvasSize,
  pageData,
  productData,
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
    if (selectedPage === productData.numOfPages) {
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
  const rightPageMargins = selectedPage !== productData.numOfPages && {
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
    // if the drag area is a single point, we are just clicking on the canvas without drag
    const singleClick = dragAreaInSvgCoordinate.width === 0 && dragAreaInSvgCoordinate.height === 0
    let mouseCoords = {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
    }
    // account for page margins in cursor position
    let dragCoords = {
      x: dragAreaInSvgCoordinate.x - pagePosition.x,
      y: dragAreaInSvgCoordinate.y - pagePosition.y,
    }
    let convertedStrokeWidth = 0

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
    const intersects = function (areaInSvgCoordinate, element, distance) {
      if (element.getAttribute("id") === "hover-clone") {
        return false
      }

      let elementBox = {}
      let bbox = element.getBBox()

      // If the element is a line, check it for a stroke width
      if (element instanceof SVGLineElement) {
        const attributes = getAttributes(element)
        const strokeWidth = attributes["stroke-width"]
        convertedStrokeWidth = convertFloatFixed(strokeWidth / 2, 3)
        
        if (bbox.height === 0) {
          bbox.height = strokeWidth
        }
      }
      else if (element instanceof SVGPathElement) {
        // check if there is at least one enclosed point in the path.
        for (let i = 0, len = element.getTotalLength(); i <= len; i += 4 /* arbitrary */) {
          let { x, y } = element.getPointAtLength(i)

          // create a box around the point where the element is "targetable"
          const areaAroundPoint = {
            x1: x - 2,
            x2: x + 2,
            y1: y - 2,
            y2: y + 2,
          }
          const { x1, x2, y1, y2 } = areaAroundPoint

          // when the drag area is a single point, check if the point is within the element's box
          if (singleClick) {
            if (
              dragCoords.x >= x1 &&
              dragCoords.x <= x2 &&
              dragCoords.y >= y1 &&
              dragCoords.y <= y2
            ) {
              return {

              }
            }
          }

          // when the drag area is a box, check if the box is within the element's box
          if (
            dragCoords.x <= x &&
            x <= dragCoords.x + areaInSvgCoordinate.width &&
            dragCoords.y <= y &&
            y <= dragCoords.y + areaInSvgCoordinate.height
          ) {
            return true
          }
        }
        return false
      }

      // bbox for the selection's box
      // with conditions where selection was just a click (a single point)
      const selectionBox = {
        x1: convertFloatFixed(dragCoords.x, 3),
        y1: convertFloatFixed(dragCoords.y, 3),
        x2: convertFloatFixed(singleClick ? 
          dragCoords.x 
          : dragCoords.x + areaInSvgCoordinate.width , 3),
        y2: convertFloatFixed(singleClick ? 
          dragCoords.y  
          : dragCoords.y + areaInSvgCoordinate.height, 3),
      }

      // bbox for the element's box
      elementBox = {
        x1: convertFloatFixed(bbox.x - distance, 3),
        y1: convertFloatFixed(bbox.y - convertedStrokeWidth - distance, 3),
        x2: convertFloatFixed(bbox.x + bbox.width + distance, 3),
        y2: convertFloatFixed(bbox.y + bbox.height - convertedStrokeWidth + distance, 3),
      }

      // check if the element's box is within the selection's box
      if (
        elementBox.x2 >= selectionBox.x1 &&
        elementBox.x1 <= selectionBox.x2 &&
        elementBox.y2 >= selectionBox.y1 &&
        elementBox.y1 <= selectionBox.y2
      ) {
        return true
      }
    }

    var getIntersections = function (svg, referenceElement, areaInSvgCoordinate, areaInInitialSvgCoordinate) {
      return collectElements([], svg, referenceElement || svg, function (element) {
        return intersects(areaInSvgCoordinate, element, 2)
      })
    };

    const selectedElements = getIntersections(
      svg,
      referenceElement,
      dragAreaInSvgCoordinate,
      dragAreaInInitialSvgCoordinate,
    )

    if (singleClick && selectedElements.length > 0) {
      // find the closest node to the current position of the cursor
      const closestNode = findClosestNode(selectedElements, mouseCoords, 2, dragCoords)
      let nodeArray = []
      nodeArray.push(closestNode)
      console.log("🚀 ~ file: PageSpread.js:254 ~ nodeArray:", nodeArray)

      return nodeArray
    }
    else {
      return selectedElements
    }
  }

  // give hover "effect" to elements to aid with selection
  const handleMouseMove = throttle(e => {
    if (!canvasState.selecting) {
      const rect = e.target.getBoundingClientRect()
      let coords = {
        x: e.clientX,
        y: e.clientY,
      }
      let adjustedCoords = {
        x: e.clientX - rect.x - pagePosition.x,
        y: e.clientY - rect.y - pagePosition.y,
      }
      const selectionPath = d3.select("#selection-path")
      
      // if there is a selection path, check if the mouse is within the path so that we can drag the entire group
      if (!selectionPath.empty()) {
        const pathBox = selectionPath.node().getBoundingClientRect()
        const isMouseInSelection = detectMouseInSelection(coords, pathBox, 2)

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
        // find the closest node to the current position of the cursor
        subject = findClosestNode(nodes, coords, 2, adjustedCoords)
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
          // const isDescending = pointerEvent.clientX > coords.clientX && pointerEvent.clientY > coords.clientY
          // const isAscending = pointerEvent.clientX < coords.clientX && pointerEvent.clientY < coords.clientY
          // const numOfElements = selectedElements.length

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
          .call(drag(dispatch, coords))
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
    >
      <CoverPage
        productData={productData}
        selectedPage={selectedPage}
        pageHeight={svgHeight}
        pageWidth={svgWidth}
      />
      <CanvasPage
        canvasPageRef={canvasPageRef}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "left" ? true : false}
        margins={leftPageMargins}
        pageData={pageData}
        pageId={leftPage}
        pagePosition={pagePosition}
        pageSide="left"
        pageTemplate={leftPageTemplate}
        productData={productData}
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
        canvasPageRef={canvasPageRef}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        margins={rightPageMargins}
        pageData={pageData}
        pageId={rightPage}
        pagePosition={pagePosition}
        pageSide="right"
        pageTemplate={rightPageTemplate}
        productData={productData}
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        setSvgSize={setSvgSize}
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