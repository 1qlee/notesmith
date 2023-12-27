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
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
}) {
  // constants
  const { svgWidth } = pageData
  const isLeftPage = selectedPage % 2 === 0
  const spreadPosition = {
    x: (canvasSize.width - productData.widthPixel * 2) / 2,
    y: (canvasSize.height - productData.heightPixel) / 2,
  }
  const isFirstPage = selectedPage === 1
  const isLastPage = selectedPage === productData.numOfPages
  const canvasRef = useRef(null)
  const canvasPageRef = useRef(null)
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const [svgLoaded, setSvgLoaded] = useState(false)
  const [hoverClone, setHoverClone] = useState(undefined)
  let coordsOffset = {
    x: isLeftPage ? leftPageData.dimensions.x : rightPageData.dimensions.x,
    y: isLeftPage ? leftPageData.dimensions.y : rightPageData.dimensions.y,
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
    // account for page margins in cursor position
    let dragCoords = {
      x: dragAreaInSvgCoordinate.x - coordsOffset.x,
      y: dragAreaInSvgCoordinate.y - coordsOffset.y,
    }
    let convertedStrokeWidth = 0

    const collectElements = function (into, svg, ancestor, filter) {
      for (let element = ancestor.firstElementChild; element; element = element.nextElementSibling) {
        for (let _i = 0, svgDragSelectElementTypes_1 = svgDragSelectElementTypes; _i < svgDragSelectElementTypes_1.length; _i++) {
          let elementType = svgDragSelectElementTypes_1[_i]

          if (element instanceof elementType && filter(element)) {
            into.push(element)
          }
        }
      }

      return into
    }

    // Updated intersects function to check cursor distance.
    const intersects = function (areaInSvgCoordinate, element, distance) {
      let elementBox = {}
      let bbox = element.getBBox()
      const nodeIsLine = element instanceof SVGLineElement
      const attributes = getAttributes(element)
      const strokeWidth = attributes["stroke-width"]
      convertedStrokeWidth = strokeWidth ? convertFloatFixed(strokeWidth / 2, 3) : 0
      const offset = nodeIsLine ? 0 : convertedStrokeWidth

      if (element.getAttribute("id") === "hover-clone") {
        return false
      }

      // If the element is a line, check it for a stroke width
      if (nodeIsLine) {
        if (bbox.height === 0) {
          bbox.height = strokeWidth
        }
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
        x1: convertFloatFixed(bbox.x - distance - offset, 3),
        y1: convertFloatFixed(bbox.y - convertedStrokeWidth - distance, 3),
        x2: convertFloatFixed(bbox.x + bbox.width + distance + offset, 3),
        y2: convertFloatFixed(bbox.y + bbox.height - convertedStrokeWidth + distance + offset * 2, 3),
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

    return getIntersections(
      svg,
      referenceElement,
      dragAreaInSvgCoordinate,
      dragAreaInInitialSvgCoordinate,
    ).filter(element => {
      const isANodeHovered = !d3.select("#hover-clone").empty()
      const hoveredNode = isANodeHovered ? d3.select("#hover-clone") : null

      // if it isn't a drag select (single click event) and there is a hovered node
      // check if the hovered node is the same as the element
      if (singleClick && isANodeHovered) {
        // all hovered nodes should have a data-for attribute with the id of the element it is hovering
        if (hoveredNode.attr("data-for") === element.getAttribute("id")) {
          d3.select("#hover-clone").remove()
          return true
        }
        else {
          return false
        }
      }

      // the element that the pointer event raised is considered to intersect.
      if (pointerEvent.target === element) {
        return true
      }

      // strictly check only <path>s.
      if (!(element instanceof SVGPathElement)) {
        return true
      }

      const attributes = getAttributes(element)
      const strokeWidth = attributes["stroke-width"]
      convertedStrokeWidth = convertFloatFixed(strokeWidth / 2, 3)

      // check if there is at least one point in the path that intersects with the selection box
      for (let i = 0, len = element.getTotalLength(); i <= len; i += 4 /* arbitrary */) {
        let { x, y } = element.getPointAtLength(i)

        if (
          dragCoords.x <= x + 2 &&
          x - 2 <= dragCoords.x + dragAreaInSvgCoordinate.width &&
          dragCoords.y <= y + 2 &&
          y - 2 <= dragCoords.y + dragAreaInSvgCoordinate.height
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
        x: e.clientX,
        y: e.clientY,
      }
      let adjustedCoords = {
        x: e.nativeEvent.offsetX - coordsOffset.x,
        y: e.nativeEvent.offsetY - coordsOffset.y,
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
        else {
          dispatch({
            type: "change-mode",
            mode: "select",
          })
        }
      }

      let subject = null
      let nodes = d3.select(canvasPageRef.current).selectChildren()

      if (nodes) {
        // find the closest node to the current position of the cursor
        subject = findClosestNode(nodes, coords, 2, canvasPageRef.current, adjustedCoords)
      }

      // create a hover-clone element which sits on top of the hovered element
      // creating an illusion of hovered effect (blue border effect)
      if (canvasPageRef.current && canvasPageRef.current.contains(subject)) {
        const node = d3.select(subject)

        // if the node is not our cloned hover node, create one
        // we only create these for single node selections
        // look for nodes that are not selected or is a selection group
        if (node.attr("data-selected") === null) {
          d3.selectAll("[data-hovered]").attr("data-hovered", null)

          // exit if we are hovering the same node repeatedly
          if (hoverClone && hoverClone.isSameNode(subject)) {
            return
          }

          // remove existing hover clone node
          d3.select("#hover-clone").remove()

          // slightly thicker stroke width so it shows over the original
          const nodeStrokeWidth = Number(node.style("stroke-width").slice(0, -2)) + 1

          // if the node is a group, add an invisible rectangle to the cloned node
          if (subject instanceof SVGGElement) {
            const nodeBBox = subject.getBBox()
            d3.select(canvasPageRef.current).append("rect")
              .raise()
              .attr("id", "hover-clone")
              .attr("stroke-width", nodeStrokeWidth)
              .attr("stroke", colors.blue.sixHundred)
              .attr("width", convertFloatFixed(nodeBBox.width, 3))
              .attr("height", convertFloatFixed(nodeBBox.height, 3))
              .attr("fill", "transparent")
              .attr("data-for", node.attr("id"))
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
              .attr("data-for", node.attr("id"))
              .style("pointer-events", "none")

            setHoverClone(subject)
          }
        }
      }
      else {
        setHoverClone(null)
        d3.selectAll("[data-hovered]").attr("data-hovered", null)
        d3.select("#hover-clone").remove()
      }
    }
  }, 50)

  useEffect(() => {
    if (isLeftPage) {
      const leftPageId = canvasPages[selectedPage - 1].pageId
      const rightPageId = isLastPage ? null : canvasPages[selectedPage].pageId
      const leftPageTemplate = canvasPageTemplates[leftPageId]
      const rightPageTemplate = canvasPageTemplates[rightPageId]
      let rightPageMargins = {}
      let rightPageDimensions = {}

      if (rightPageId) {
        rightPageMargins = {
          top: convertToPx(rightPageTemplate.marginTop),
          right: convertToPx(rightPageTemplate.marginRight),
          bottom: convertToPx(rightPageTemplate.marginBottom),
          left: convertToPx(rightPageTemplate.marginLeft),
        }
        rightPageDimensions = {
          height: convertFloatFixed(rightPageData.dimensions.height - rightPageMargins.top - rightPageMargins.bottom, 3),
          width: convertFloatFixed(rightPageData.dimensions.width - rightPageMargins.left - rightPageMargins.right, 3),
          x: svgWidth + holesMargin + rightPageMargins.left,
          y: minimumMargin + rightPageMargins.top,
        }
        setRightPageData({
          ...rightPageData,
          active: false,
          dimensions: rightPageDimensions,
          margins: rightPageMargins,
          pageId: rightPageId,
          side: "right",
          svg: rightPageTemplate.svg,
        })
      }
      else {
        setRightPageData({
          ...rightPageData,
          active: false,
          side: "right",
        })
      }

      const leftPageMargins = {
        top: convertToPx(leftPageTemplate.marginTop),
        right: convertToPx(leftPageTemplate.marginRight),
        bottom: convertToPx(leftPageTemplate.marginBottom),
        left: convertToPx(leftPageTemplate.marginLeft),
      }
      const leftPageDimensions = {
        height: convertFloatFixed(leftPageData.dimensions.height - leftPageMargins.top - leftPageMargins.bottom, 3),
        width: convertFloatFixed(leftPageData.dimensions.width - leftPageMargins.left - leftPageMargins.right, 3),
        x: minimumMargin + leftPageMargins.left,
        y: minimumMargin + leftPageMargins.top,
      }

      setLeftPageData({
        ...leftPageData,
        active: true,
        dimensions: leftPageDimensions,
        margins: leftPageMargins,
        pageId: leftPageId,
        side: "left",
        svg: leftPageTemplate.svg,
      })
      
    }
    else {
      const leftPageId = isFirstPage ? null : canvasPages[selectedPage - 2].pageId
      const rightPageId = canvasPages[selectedPage - 1].pageId
      const leftPageTemplate = canvasPageTemplates[leftPageId]
      const rightPageTemplate = canvasPageTemplates[rightPageId]
      let leftPageMargins = {}
      let leftPageDimensions = {}

      if (leftPageId) {
        leftPageMargins = {
          top: convertToPx(leftPageTemplate.marginTop),
          right: convertToPx(leftPageTemplate.marginRight),
          bottom: convertToPx(leftPageTemplate.marginBottom),
          left: convertToPx(leftPageTemplate.marginLeft),
        }
        leftPageDimensions = {
          height: convertFloatFixed(leftPageData.dimensions.height - leftPageMargins.top - leftPageMargins.bottom, 3),
          width: convertFloatFixed(leftPageData.dimensions.width - leftPageMargins.left - leftPageMargins.right, 3),
          x: minimumMargin + leftPageMargins.left,
          y: minimumMargin + leftPageMargins.top,
        }

        setLeftPageData({
          ...leftPageData,
          active: false,
          dimensions: leftPageDimensions,
          margins: leftPageMargins,
          pageId: leftPageId,
          side: "left",
          svg: leftPageTemplate.svg,
        })
      }
      else {
        setLeftPageData({
          ...leftPageData,
          active: false,
          side: "left",
        })
      }

      const rightPageMargins = {
        top: convertToPx(rightPageTemplate.marginTop),
        right: convertToPx(rightPageTemplate.marginRight),
        bottom: convertToPx(rightPageTemplate.marginBottom),
        left: convertToPx(rightPageTemplate.marginLeft),
      }
      const rightPageDimensions = {
        height: convertFloatFixed(rightPageData.dimensions.height - rightPageMargins.top - rightPageMargins.bottom, 3),
        width: convertFloatFixed(rightPageData.dimensions.width - rightPageMargins.left - rightPageMargins.right, 3),
        x: svgWidth + holesMargin + rightPageMargins.left,
        y: minimumMargin + rightPageMargins.top,
      }

      setRightPageData({
        ...rightPageData,
        active: true,
        dimensions: rightPageDimensions,
        margins: rightPageMargins,
        pageId: rightPageId,
        side: "right",
        svg: rightPageTemplate.svg,
      })
    }

    let referenceElement = null
    // this is how we know we have the canvas page loaded
    const isCanvasPage = svgLoaded === selectedPage ? true : false

    if (isCanvasPage) {
      referenceElement = canvasPageRef.current
      // pagePosition = {
      //   x: isLeftPage ? minimumMargin + leftPageMargins.left : svgWidth + holesMargin + rightPageMargins.left,
      //   y: isLeftPage ? minimumMargin + leftPageMargins.top : minimumMargin + rightPageMargins.top,
      // }
    }

    dispatch({
      type: "initialize",
      canvas: referenceElement,
    })

    console.log(canvasPageRef.current)

    if (canvasState.mode === "select" && referenceElement) {
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
          .call(drag(dispatch))
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
      height={productData.heightPixel + 2}
      width={productData.widthPixel * 2 + 3}
      x={spreadPosition.x}
      y={spreadPosition.y}
      onMouseMove={e => handleMouseMove(e)}
    >
      <CoverPage
        productData={productData}
        selectedPage={selectedPage}
      />
      <CanvasPage
        canvasPageRef={canvasPageRef}
        pageData={leftPageData}
        productData={productData}
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setPageData={setLeftPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        templateData={pageData}
        setTemplateData={setPageData}
      />
      <CanvasPage
        canvasPageRef={canvasPageRef}
        pageData={rightPageData}
        setPageData={setRightPageData}
        productData={productData}
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        templateData={pageData}
        setTemplateData={setPageData}
      />
      {canvasState.selectedElements.length > 0 && canvasState.selectionPath && (
        <Selection
          position={coordsOffset}
          path={canvasState.selectionPath}
        />
      )}
    </svg>
  )
}

export default PageSpread