import React, { useEffect, useState, useRef } from "react"
import { pageMargins, colors } from "../../styles/variables"
import { convertToPx, convertFloatFixed } from "../../utils/helper-functions"
import svgDragSelect from "svg-drag-select"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import * as d3 from "d3"
import drag from "./editor/drag"
import { throttle } from "lodash"

import CoverPage from "./pageComponents/CoverPage"
import Selection from "./Selection"
import CanvasPage from "./editor/CanvasPage"
import { createPortal } from "react-dom"

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
  const [multi, setMulti] = useState(false)
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
    dragAreaInSvgCoordinate,
    dragAreaInInitialSvgCoordinate,
  }) => {
    var svgDragSelectElementTypes = [SVGCircleElement, SVGEllipseElement, SVGImageElement, SVGLineElement, SVGPathElement, SVGPolygonElement, SVGPolylineElement, SVGRectElement, SVGTextElement, SVGUseElement];

    var collectElements = function (into, svg, ancestor, filter) {
      for (var element = ancestor.firstElementChild; element; element = element.nextElementSibling) {
        if (element instanceof SVGGElement) {
          collectElements(into, svg, element, filter);
          continue;
        }
        for (var _i = 0, svgDragSelectElementTypes_1 = svgDragSelectElementTypes; _i < svgDragSelectElementTypes_1.length; _i++) {
          var elementType = svgDragSelectElementTypes_1[_i];
          if (element instanceof elementType && filter(element)) {
            into.push(element);
          }
        }
      }
      return into;
    };

    var inRange = function (x, min, max) { return (min <= x && x <= max); };

    // Updated intersects function to check cursor distance.
    var intersects = function (areaInSvgCoordinate, bbox) {
      var left = areaInSvgCoordinate.x;
      var right = left + areaInSvgCoordinate.width;
      var top = areaInSvgCoordinate.y;
      var bottom = top + areaInSvgCoordinate.height;
      return ((inRange(bbox.x, left, right) || inRange(bbox.x + bbox.width, left, right) || inRange(left, bbox.x, bbox.x + bbox.width)) &&
        (inRange(bbox.y, top, bottom) || inRange(bbox.y + bbox.height, top, bottom) || inRange(top, bbox.y, bbox.y + bbox.height)));
    };

    function expandSVGRect(rect, margin) {
      // Create a new SVGRect object using createSVGRect.
      rect.x = rect.x - margin;
      rect.y = rect.y - margin;
      rect.width = rect.width + 2 * margin;
      rect.height = rect.height + 2 * margin;

      return rect;
    }

    var getIntersections = function (svg, referenceElement, areaInSvgCoordinate, areaInInitialSvgCoordinate, cursorX, cursorY, maxDistance) {
      return svg.getIntersectionList
        ? Array.prototype.slice.call(svg.getIntersectionList(expandSVGRect(areaInInitialSvgCoordinate, 3), referenceElement))
        : collectElements([], svg, referenceElement || svg, function (element) {
          return intersects(areaInSvgCoordinate, element.getBBox());
        });
    };

    // Extract cursor position from the pointer event.
    const cursorX = pointerEvent.clientX;
    const cursorY = pointerEvent.clientY;

    // Define the maximum distance for selection (5 pixels).
    const maxDistance = 3;

    return getIntersections(
      svg,
      referenceElement,
      dragAreaInSvgCoordinate,
      dragAreaInInitialSvgCoordinate,
      cursorX,
      cursorY,
      maxDistance
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
  };

  // give hover "effect" to elements to aid with selection
  const handleMouseMove = throttle(e => {
    if (!canvasState.selecting) {
      let mouseY = e.clientY
      let mouseX = e.clientX
      // Choose the element that is closest to the pointer for dragging, within a specified threshold.
      let subject = null
      let distance = 3
      let nodes = d3.select(canvasPageRef.current).selectAll("*")._groups[0]

      if (nodes) {
        for (const node of nodes) {
          if (d3.select(node).attr("id") === "hover-clone") {
            continue
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
            subject = node
            break; // Break early if a valid subject is found.
          }
        }
      }

      // create a hover-clone element which sits on top of the hovered element
      // creating an illusion of hovered effect (blue border effect)
      if (canvasPageRef.current && canvasPageRef.current.contains(subject)) {
        const node = d3.select(subject)

        // don't work with hover clone node
        if (node.attr("id") === "hover-clone") return

        // if the node is not our cloned hover node, create one
        // we only create these for single node selections
        // look for nodes that are not selected or is a selection group
        if (node.attr("data-selected") === null && node.attr("id") !== "selected-elements") {
          // check if there is a hover clone already
          const cloneNotFound = d3.selectAll("#hover-clone").empty()
          d3.selectAll("[data-hovered]").attr("data-hovered", null)

          // if there is no clone, then create one
          if (cloneNotFound) {
            // slightly thicker stroke width so it shows over the original
            const nodeStrokeWidth = Number(node.style("stroke-width").slice(0, -2)) + 1

            // if the node is a group, add an invisible rectangle to the cloned node
            if (node.node().nodeName === "g") {
              const groupClone = node.clone()
                .raise()
                .attr("id", "hover-clone")
                .style("pointer-events", "none")
                .append("rect")
                .attr("fill", "transparent")

              setHoverClone(groupClone.node())
            }
            else {
              const nodeClone = node.clone()
                .raise()
                .attr("id", "hover-clone")
                .attr("stroke-width", nodeStrokeWidth)
                .attr("fill", "transparent")
                .attr("stroke", colors.blue.sixHundred)
                .style("pointer-events", "none")

              setHoverClone(nodeClone.node())
            }
          }
          // otherwise find the clone and do a comparison check against hoveredClone in state
          else {
            if (d3.select("#hover-clone").node() === hoverClone) {
              return
            }
            else {
              setHoverClone(null)
            }
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
      const {
        cancel,           // cleanup function.
        // please call `cancel()` when the select-on-drag behavior is no longer needed.
        dragAreaOverlay,  // a div element overlaying dragging area.
        // you can customize the style of this element.
        // this element has "svg-drag-select-area-overlay" class by default.
      } = svgDragSelect({
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

          // remove any existing hover clones before starting selection
          d3.selectAll("#hover-clone").remove()

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
          const numOfElements = selectedElements.length
          if (numOfElements > 0) {
            dispatch({
              type: "select",
              selectedElements: selectedElements,
            })
            
            if (numOfElements > 1) {
              setMulti(true)
            }
            else {
              setMulti(false)
            }
          }

          dispatch({
            type: "toggle",
            setting: "selecting",
            value: false,
          })
        }
      })

      if (canvasRef.current && referenceElement) {
        // all the child nodes of the canvas page
        const nodes = d3.select(referenceElement).selectAll("*")._groups[0]

        if (nodes) {
          d3.select(canvasRef.current).call(drag(nodes, dispatch))
        }
      }

      return () => {
        cancel()
      }
    }
  }, [canvasState.mode, canvasState.canvas, canvasPageRef, svgLoaded, selectedPage, multi])

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
      {(canvasState.selectedElements.length > 0 || canvasState.tempSelectedElements.length > 0) && (
        <Selection
          position={pagePosition}
        />
      )}
    </svg>
  )
}

export default PageSpread