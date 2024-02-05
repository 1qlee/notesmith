import React, { useEffect, useState, useRef } from "react"
import { convertToPx, convertFloatFixed } from "../../utils/helper-functions"
import { colors } from "../../styles/variables"
import { throttle } from "lodash"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import { findClosestNode, detectMouseInSelection, getAttributes } from "./editor/editor-functions"
import { SVG } from '@svgdotjs/svg.js'
import drag from "./editor/helpers/drag"
import dragSelector from "./editor/drag-selector"

import CoverPage from "./pageComponents/CoverPage"
import Selection from "./Selection"
import CanvasPage from "./editor/CanvasPage"

function PageSpread({
  canvasPageTemplates,
  canvasPages,
  leftPageData,
  pageData,
  productData,
  rightPageData,
  selectedPage,
  selectedPageSvg,
  setLeftPageData,
  setMax,
  setPageData,
  setRightPageData,
  setSelectedPageSvg,
}) {
  // constants
  const isLeftPage = selectedPage % 2 === 0
  const canvasRef = useRef(null)
  const canvasPageRef = useRef(null)
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const [dragCanvas, setDragCanvas] = useState({
    canvas: false,
    ref: null,
  })
  const [svgLoaded, setSvgLoaded] = useState(false)
  const [hoverClone, setHoverClone] = useState(undefined)
  const distance = 2
  let coordsOffset = {
    x: isLeftPage ? pageData.x + convertToPx(pageData.marginLeft) : pageData.x + convertToPx(pageData.marginLeft),
    y: isLeftPage ? pageData.y + convertToPx(pageData.marginTop) : pageData.y + convertToPx(pageData.marginTop),
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
      let xOffset = nodeIsLine ? 0 : convertedStrokeWidth
      let yOffset = nodeIsLine ? 0 : convertedStrokeWidth

      if (element.getAttribute("id") === "hover-clone") {
        return false
      }

      // bbox for the selection box
      // with conditions where selection was just a click (a single point)
      const selectionBox = {
        x1: convertFloatFixed(dragCoords.x, 3),
        y1: convertFloatFixed(dragCoords.y, 3),
        x2: convertFloatFixed(singleClick ?
          dragCoords.x
          : dragCoords.x + areaInSvgCoordinate.width, 3),
        y2: convertFloatFixed(singleClick ?
          dragCoords.y
          : dragCoords.y + areaInSvgCoordinate.height, 3),
      }

      // If the element is a line, check it for a stroke width
      if (nodeIsLine) {
        // horizontal line
        if (bbox.height === 0) {
          bbox.height = strokeWidth
          yOffset = convertedStrokeWidth
        }
        // vertical line
        else if (bbox.width === 0) {
          bbox.width = strokeWidth
          xOffset = convertedStrokeWidth
        }
      }

      // bbox for the element's box
      elementBox = {
        x1: convertFloatFixed(bbox.x - distance - xOffset, 3),
        y1: convertFloatFixed(bbox.y - distance - yOffset, 3),
        x2: convertFloatFixed(bbox.x + bbox.width + distance + xOffset, 3),
        y2: convertFloatFixed(bbox.y + bbox.height + distance + yOffset, 3),
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
        return intersects(areaInSvgCoordinate, element, distance)
      })
    };

    return getIntersections(
      svg,
      referenceElement,
      dragAreaInSvgCoordinate,
      dragAreaInInitialSvgCoordinate,
    ).filter(element => {
      const hoveredNode = SVG("#hover-clone")

      if (hoveredNode) {
        hoveredNode.remove()
      }

      // the element that the pointer event raised is considered to intersect.
      if (pointerEvent.target === element) {
        return true
      }

      // strictly check only <path>s.
      if (!(element instanceof SVGPathElement) && !(element instanceof SVGLineElement)) {
        return true;
      }

      const attributes = getAttributes(element)
      const strokeWidth = attributes["stroke-width"]
      convertedStrokeWidth = convertFloatFixed(strokeWidth / 2, 3)

      // check if there is at least one point in the path that intersects with the selection box
      for (let i = 0, len = element.getTotalLength(); i <= len; i += 4 /* arbitrary */) {
        let { x, y } = element.getPointAtLength(i)

        if (
          dragCoords.x <= x + distance + convertedStrokeWidth &&
          x - distance - convertedStrokeWidth <= dragCoords.x + dragAreaInSvgCoordinate.width &&
          dragCoords.y <= y + distance + convertedStrokeWidth  &&
          y - distance - convertedStrokeWidth <= dragCoords.y + dragAreaInSvgCoordinate.height
        ) {
          return true
        }
      }
      return false
    })
  }

  // give hover "effect" to elements to aid with selection
  const handleMouseMove = throttle(e => {
    if (!canvasState.selecting && !pageData.template) {
      let coords = {
        x: e.clientX,
        y: e.clientY,
      }
      let adjustedCoords = {
        x: e.nativeEvent.offsetX - coordsOffset.x,
        y: e.nativeEvent.offsetY - coordsOffset.y,
      }
      const selectionPath = SVG("#selection-path")
      
      // if there is a selection path, check if the mouse is within the path so that we can drag the entire group
      if (selectionPath) {
        const boundingBox = selectionPath.rbox()
        const pathBox = {
          left: boundingBox.x,
          right: boundingBox.x2,
          top: boundingBox.y,
          bottom: boundingBox.y2,
        }
        const isMouseInSelection = detectMouseInSelection(coords, pathBox, 2)

        if (isMouseInSelection) {
          // remove existing hover clone node
          if (SVG("#hover-clone")) {
            SVG("#hover-clone").remove()
            setHoverClone(null)
          }
          
          dispatch({
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

      if (canvasState.mode !== "drag") {
        let subject = null
        let nodes = SVG(canvasPageRef.current).children()

        if (nodes) {
          // find the closest node to the current position of the cursor
          subject = findClosestNode(nodes, coords, 2, canvasPageRef.current, adjustedCoords)
        }

        // create a hover-clone element which sits on top of the hovered element
        // creating an illusion of hovered effect (blue border effect)
        if (subject && canvasPageRef.current && SVG(canvasPageRef.current).has(subject)) {
          const node = subject
          const nodeIsSelected = node.attr("data-selected") === ""

          // if the node is not our cloned hover node, create one
          // we only create these for single node selections
          // look for nodes that are not selected or is a selection group
          if (!nodeIsSelected) {
            SVG(canvasPageRef.current).find("data-hovered").attr("data-hovered", null)

            // exit if we are hovering the same node repeatedly
            if (hoverClone && hoverClone.isSameNode(subject.node)) {
              return
            }

            // remove existing hover clone node
            if (SVG("#hover-clone")) {
              SVG("#hover-clone").remove()
              setHoverClone(null)
            }

            // slightly thicker stroke width so it shows over the original
            const nodeStrokeWidth = Number(node.attr("stroke-width")) + 1

            // if the node is a group, add an invisible rectangle to the cloned node
            if (node.node instanceof SVGGElement) {
              const nodeBBox = node.bbox()

              SVG(`<rect id="hover-clone" stroke="${colors.blue.sixHundred}" fill="transparent" width="${convertFloatFixed(nodeBBox.width, 3)}" height="${convertFloatFixed(nodeBBox.height, 3)}" style="pointer-events:none;transform:translate(${nodeBBox.x}px, ${nodeBBox.y}px)"></rect>`)
                .addTo(SVG(canvasPageRef.current))
                .front()

              setHoverClone(node.node)
            }
            else {
              const clone = node.clone()
            
              clone.addTo(SVG(canvasPageRef.current))
                .front()
                .attr("id", "hover-clone")
                .attr("stroke-width", nodeStrokeWidth)
                .attr("fill", "transparent")
                .attr("stroke", colors.blue.sixHundred)
                .attr("data-for", node.attr("id"))

              clone.css("pointer-events", "none")

              setHoverClone(node.node)
            }
          }
        }
        else {
          setHoverClone(null)
          SVG(canvasPageRef.current).find("data-hovered").attr("data-hovered", null)

          if (SVG("#hover-clone")) {
            SVG("#hover-clone").remove()
          }
        }
      }
    }
  }, 50)

  useEffect(() => {
    let referenceElement = null
    // this is how we know we have the canvas page loaded
    const isCanvasPage = svgLoaded === selectedPage ? true : false

    if (isCanvasPage) {
      referenceElement = canvasPageRef.current

      if (!dragCanvas.canvas) {
        const canvas = SVG(canvasRef.current)

        setDragCanvas({
          ref: referenceElement,
          canvas: canvas,
        })
        drag(dispatch, canvas, referenceElement)
      }
      else {
        if (!dragCanvas.ref.isSameNode(referenceElement)) {
          SVG(canvasRef.current).draggable(false)
          SVG(canvasRef.current).off()

          const canvas = SVG(canvasRef.current)

          setDragCanvas({
            canvas: canvas,
            ref: referenceElement,
          })
          drag(dispatch, canvas, referenceElement)
        }
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
      onMouseMove={e => handleMouseMove(e)}
    >
      <CoverPage
        productData={productData}
        selectedPage={selectedPage}
      />
      <CanvasPage
        canvasPages={canvasPages}
        canvasPageTemplates={canvasPageTemplates}
        canvasPageRef={canvasPageRef}
        currentPageData={leftPageData}
        productData={productData}
        pageSide="left"
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setCurrentPageData={setLeftPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        setPageData={setPageData}
        pageData={pageData}
      />
      <CanvasPage
        canvasPages={canvasPages}
        canvasPageTemplates={canvasPageTemplates}
        canvasPageRef={canvasPageRef}
        currentPageData={rightPageData}
        pageSide="right"
        productData={productData}
        selectedPage={selectedPage}
        selectedPageSvg={selectedPageSvg}
        setMax={setMax}
        setCurrentPageData={setRightPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        setPageData={setPageData}
        pageData={pageData}
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