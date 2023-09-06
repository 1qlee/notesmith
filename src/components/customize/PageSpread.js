import React, { useEffect, useState, useRef } from "react"
import { pageMargins, colors } from "../../styles/variables"
import { convertToPx } from "../../utils/helper-functions"
import svgDragSelect from "svg-drag-select"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import * as d3 from "d3"

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

  // stricter selection finder logic for paths
  const strictIntersectionSelector = ({
    svg,                            // the svg element.
    referenceElement,               // please select only descendants of this SVGElement if specified.
    pointerEvent,                   // a `PointerEvent` instance with either a "pointerdown" event or a "pointermove" event.
    // (in case of Safari, a `MouseEvent` or a `TouchEvent` is used instead.)
    dragAreaInClientCoordinate,     // a `SVGRect` that represents the dragging area in client coordinate.
    dragAreaInSvgCoordinate,        // a `SVGRect` that represents the dragging area in svg coordinate.
    dragAreaInInitialSvgCoordinate, // a `SVGRect` that represents the dragging area in initial viewport coordinate of the svg.
    getEnclosures,                  // `getEnclosures()` returns elements enclosed in the dragging area.
    getIntersections,               // `getIntersections()` returns elements intersect the dragging area.
    // Chrome, Safari and Firefox checks only bounding box intersection.
  }) => getIntersections().filter(element => {
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

  function parseDragElements(node, nodeName, event) {
    // handle various node types (shapes, lines, text, etc.)
    switch (nodeName) {
      case "circle":
      case "ellipse":
        let circle = node
        let cx = parseFloat(circle.attr("cx")) + event.dx
        let cy = parseFloat(circle.attr("cy")) + event.dy

        node
          .raise()
          .attr("cx", cx)
          .attr("cy", cy)
        break;

      case "line":
        let line = node
        let x1 = parseFloat(line.attr("x1")) + event.dx
        let y1 = parseFloat(line.attr("y1")) + event.dy
        let x2 = parseFloat(line.attr("x2")) + event.dx
        let y2 = parseFloat(line.attr("y2")) + event.dy

        node
          .raise()
          .attr("x1", x1)
          .attr("x2", x2)
          .attr("y1", y1)
          .attr("y2", y2)
        break;

      default:
        node
          .raise()
          .attr("x", event.x)
          .attr("y", event.y)
        break;
    }
  }

  function handleMouseMove(e) {
    function dragstart(event, d) {
      console.log("dragstart")
    }

    function dragged(event, d) {
      console.log("draggin")

      // change mode to drag if it is not already
      if (canvasState.mode !== "drag") {
        dispatch({
          type: "change-mode",
          mode: "drag",
        })
      }

      const nodeName = this.nodeName
      const node = d3.select(this)

      parseDragElements(node, nodeName, event)

      dispatch({
        type: "drag-selection",
      })
    }

    function draggedMulti(event, d) {
      console.log("dragging multi")

      // change mode to drag if it is not already
      if (canvasState.mode !== "drag") {
        dispatch({
          type: "change-mode",
          mode: "drag",
        })
      }

      // all elements inside #selected-elements <g>
      const childNodes = d3.select(this).selectAll("*")._groups[0]

      for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        const node = d3.select(childNode)
        const nodeName = childNode.nodeName
        // 'childNode' is the actual child DOM element
        parseDragElements(node, nodeName, event)
      }
    }

    function dragend(event, d) {
      console.log("dragEnd")
      const test = []
      test.push(this)
      dispatch({
        type: "change-mode",
        mode: "select",
      })
    }

    // if the currently moused element is a child of the current page ref
    // this prevents us from manipulating the wrong elements
    if (canvasPageRef.current && canvasPageRef.current.contains(e.target)) {
      const node = d3.select(e.target)

      // don't work with hover clone node
      if (node.attr("id") === "hover-clone") return

      // if the node is not our cloned hover node, create one
      // we only create these for single node selections
      // look for nodes that are not selected or is a selection group
      if (node.attr("data-selected") === null && node.attr("id") !== "selected-elements") {
        node.attr("data-hovered", "")
        // remove any existing
        d3.selectAll("#hover-clone").remove()

        // slightly thicker stroke width so it shows over the original
        const nodeStrokeWidth = Number(node.style("stroke-width").slice(0, -2)) + 1
        node.clone()
          .raise()
          .attr("id", "hover-clone")
          .attr("stroke-width", nodeStrokeWidth)
          .attr("fill", "transparent")
          .attr("stroke", colors.blue.sixHundred)
          .style("pointer-events", "none")
      }

      // when there are multiple nodes selected
      if (node.attr("id") === "selected-elements") {
        dispatch({
          type: "change-mode",
          mode: "drag"
        })
        node.call(d3.drag()
          .on("start", dragstart)
          .on("drag", draggedMulti)
          .on("end", dragend))
      }
      else {
        node.call(d3.drag()
          .on("start", dragstart)
          .on("drag", dragged)
          .on("end", dragend))
      }
    }
    else {
      dispatch({
        type: "change-mode",
        mode: "select"
      })
      d3.selectAll("[data-hovered]").attr("data-hovered", null).attr("filter", null)
      d3.select("#hover-clone").remove()
    }
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
        selector: strictIntersectionSelector,      // "enclosure": selects enclosed elements using getEnclosureList().
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
          if (selectedElements.length > 0) {
            dispatch({
              type: "select",
              selectedElements: selectedElements,
            })
          }
        },
      })

      return () => {
        cancel()
      }
    }
  }, [canvasState.mode, canvasPageRef, svgLoaded, selectedPage])

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

// const getSelections = ({
//   svg,
//   referenceElement,
//   pointerEvent, // listens to click and drag events
//   dragAreaInClientCoordinate,
//   dragAreaInSvgCoordinate,
//   dragAreaInInitialSvgCoordinate,
// }) => {
//   var svgDragSelectElementTypes = [SVGCircleElement, SVGEllipseElement, SVGImageElement, SVGLineElement, SVGPathElement, SVGPolygonElement, SVGPolylineElement, SVGRectElement, SVGTextElement, SVGUseElement];

//   var collectElements = function (into, svg, ancestor, filter) {
//     for (var element = ancestor.firstElementChild; element; element = element.nextElementSibling) {
//       if (element instanceof SVGGElement) {
//         collectElements(into, svg, element, filter);
//         continue;
//       }
//       for (var _i = 0, svgDragSelectElementTypes_1 = svgDragSelectElementTypes; _i < svgDragSelectElementTypes_1.length; _i++) {
//         var elementType = svgDragSelectElementTypes_1[_i];
//         if (element instanceof elementType && filter(element)) {
//           into.push(element);
//         }
//       }
//     }
//     return into;
//   };

//   var inRange = function (x, min, max) { return (min <= x && x <= max); };

//   // Updated intersects function to check cursor distance.
//   var intersects = function (areaInSvgCoordinate, bbox) {
//     var left = areaInSvgCoordinate.x;
//     var right = left + areaInSvgCoordinate.width;
//     var top = areaInSvgCoordinate.y;
//     var bottom = top + areaInSvgCoordinate.height;
//     return ((inRange(bbox.x, left, right) || inRange(bbox.x + bbox.width, left, right) || inRange(left, bbox.x, bbox.x + bbox.width)) &&
//       (inRange(bbox.y, top, bottom) || inRange(bbox.y + bbox.height, top, bottom) || inRange(top, bbox.y, bbox.y + bbox.height)));
//   };

//   function expandSVGRect(rect, margin) {
//     // Create a new SVGRect object using createSVGRect.
//     rect.x = rect.x - margin;
//     rect.y = rect.y - margin;
//     rect.width = rect.width + 2 * margin;
//     rect.height = rect.height + 2 * margin;

//     return rect;
//   }

//   var getIntersections = function (svg, referenceElement, areaInSvgCoordinate, areaInInitialSvgCoordinate, cursorX, cursorY, maxDistance) {
//     return svg.getIntersectionList
//       ? Array.prototype.slice.call(svg.getIntersectionList(expandSVGRect(areaInInitialSvgCoordinate, 0), referenceElement))
//       : collectElements([], svg, referenceElement || svg, function (element) {
//         return intersects(areaInSvgCoordinate, element.getBBox());
//       });
//   };

//   // Extract cursor position from the pointer event.
//   const cursorX = pointerEvent.clientX;
//   const cursorY = pointerEvent.clientY;

//   // Define the maximum distance for selection (5 pixels).
//   const maxDistance = 3;

//   return getIntersections(
//     svg,
//     referenceElement,
//     dragAreaInSvgCoordinate,
//     dragAreaInInitialSvgCoordinate,
//     cursorX,
//     cursorY,
//     maxDistance
//   ).filter(element => {
//     // the element that the pointer event raised is considered to intersect.
//     if (pointerEvent.target === element) {
//       return true
//     }
//     // strictly check only <path>s.
//     if (!(element instanceof SVGPathElement)) {
//       return true
//     }

//     // check if there is at least one enclosed point in the path.
//     for (let i = 0, len = element.getTotalLength(); i <= len; i += 4 /* arbitrary */) {
//       let { x, y } = element.getPointAtLength(i)

//       let dragCoords = {
//         x: dragAreaInSvgCoordinate.x - 12,
//         y: dragAreaInSvgCoordinate.y - 12,
//       }
//       if (pageData.template) {
//         dragCoords.x = dragCoords.x - templateMargins.left
//         dragCoords.y = dragCoords.y - templateMargins.top
//       }
//       else {
//         if (pageIsLeft) {
//           dragCoords.x = dragCoords.x - leftPageMargins.left
//           dragCoords.y = dragCoords.y - leftPageMargins.top
//         }
//         else {
//           dragCoords.x = dragCoords.x - rightPageMargins.left
//           dragCoords.y = dragCoords.y - rightPageMargins.top
//         }
//       }

//       if (!pageIsLeft) {
//         dragCoords.x = dragCoords.x - svgWidth - holesMargin + 12
//       }

//       if (
//         dragCoords.x <= x && x <= dragCoords.x + dragAreaInSvgCoordinate.width &&
//         dragCoords.y <= y && y <= dragCoords.y + dragAreaInSvgCoordinate.height
//       ) {
//         return true
//       }
//     }
//     return false
//   })
// };