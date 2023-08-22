import React, { useEffect, useState, useRef } from "react"
import { pageMargins } from "../../styles/variables"
import { convertToPx } from "../../utils/helper-functions"
import SVG from "react-inlinesvg"
import svgDragSelect from "svg-drag-select"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import * as d3 from "d3"

import Template from "./pageComponents/Template"
import PageBackground from "./pageComponents/PageBackground"
import CoverPage from "./pageComponents/CoverPage"
import Selection from "./Selection"

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

  useEffect(() => {
    const canvas = canvasRef.current
    let referenceElement = null
    const isCanvasPage = svgLoaded === selectedPage ? true : false
    // const isTemplate = (pageData.template && selectedPageSvg) ? true : false

    // if (isTemplate) {
    //   referenceElement = selectedPageSvg
    //   margins = templateMargins
    //   pagePosition = {
    //     x: pageIsLeft ? minimumMargin + templateMargins.left : svgWidth + holesMargin + templateMargins.left,
    //     y: minimumMargin + templateMargins.top,
    //   }
    // }
    if (isCanvasPage) {
      referenceElement = canvasPageRef.current
      pagePosition = {
        x: pageIsLeft ? minimumMargin + leftPageMargins.left : svgWidth + holesMargin + rightPageMargins.left,
        y: pageIsLeft ? minimumMargin + leftPageMargins.top : minimumMargin + rightPageMargins.top,
      }

      const clicked = (event, d) => {
        console.log("Click")
        console.log(event)
        if (event.defaultPrevented) return; // dragged

        console.log(d)
      }

      const mouseover = (event, d) => {
        console.log("mouseover")
        const { target } = event

        d3.select(target).call(drag())
        console.log(event.target)
        console.log(d)
      }

      const drag = () => {
        function dragstart(event, d) {
          console.log("dragstart")
          console.log(event)
          console.log(d)
        }

        function dragged(event, d) {
          console.log("draggin")
          d3.select(this).raise().attr("cx", event.x).attr("cy", event.y);
          dispatch({
            type: "change-mode",
            mode: "drag",
          })
          dispatch({
            type: "remove-selectionPath"
          })
        }

        function dragend(event, d) {
          console.log("dragEnd")
          console.log(this)
          const test = []
          test.push(this)
          dispatch({
            type: "change-mode",
            mode: "select",
          })
          dispatch({
            type: "change-selection",
            selectedElements: test,
            newlySelectedElements: test,
          })
        }

        return d3.drag()
          .on("start", dragstart)
          .on("drag", dragged)
          .on("end", dragend)
      }
      d3.select(referenceElement)
        .on("click", clicked)
        .on("mouseover", mouseover)
    }

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

          dispatch({
            type: "reset",
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
  }, [canvasState.mode, canvasPages, pageData, canvasPageRef, svgLoaded, selectedPage, selectedPageSvg])

  const handleMouseOver = (event) => {
    const node = event.target
    
    // check if the node is a child of canvas page
    if (canvasPageRef.current.contains(node)) {
      dispatch({
        type: "hover-selection",
        hoveredElement: node,
      })
    }
    else {
      dispatch({
        type: "hover-selection",
        hoveredElement: null,
      })
    }
  }

  return (
    <svg
      id="page-spread"
      ref={canvasRef}
      xmlns="http://www.w3.org/2000/svg"
      height={svgHeight + 2}
      width={svgWidth * 2 + 3}
      x={spreadPosition.x}
      y={spreadPosition.y}
    >
      <CoverPage
        bookData={bookData}
        selectedPage={selectedPage}
        pageHeight={svgHeight}
        pageWidth={svgWidth}
      />
      <Page
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
      <Page
        bookData={bookData}
        canvasPageRef={canvasPageRef}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        margins={rightPageMargins}
        pageData={pageData}
        pageId={leftPage}
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

function Page({
  bookData,
  canvasPageRef,
  currentPageSide,
  isSelected,
  margins,
  pageData,
  pagePosition,
  pageSide,
  pageTemplate,
  selectedPage,
  selectedPageSvg,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
  setSvgSize,
  setMax,
}) {
  const dispatch = useEditorDispatch()
  const maxSvgSize = {
    height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
    width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
  }
  const isLeftPage = pageSide === "left"

  useEffect(() => {
    if (isSelected) {
      setSvgLoaded(selectedPage)
    }

    dispatch({
      type: "reset"
    })
  }, [selectedPage])

  const handleSvgLoad = (src) => {
    if (src && isSelected) {
      setSvgLoaded(selectedPage)
    }
  }

  if (selectedPage === 1 && pageSide === "left") {
    return null
  }
  else if (selectedPage === bookData.numOfPages && pageSide === "right") {
    return null
  }
  else {
    return (
      <>
        <PageBackground
          currentPageSide={currentPageSide}
          isSelected={isSelected}
          pageHeight={pageData.svgHeight}
          pageWidth={pageData.svgWidth}
          pageSide={pageSide}
          suppressContentEditableWarning={true}
        />
        {pageData.template && isSelected ? (
          <Template
            bookData={bookData}
            currentPageSide={currentPageSide}
            maxSvgSize={maxSvgSize}
            pageData={pageData}
            pagePosition={pagePosition}
            selectedPageSvg={selectedPageSvg}
            setMax={setMax}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgSize={setSvgSize}
            setSvgLoaded={setSvgLoaded}
            suppressContentEditableWarning={true}
          />
        ) : (
          <SVG
            innerRef={isSelected ? canvasPageRef : null}
            onLoad={(src) => handleSvgLoad(src)}
            id={isLeftPage ? "left-page" : "right-page"}
            xmlns="http://www.w3.org/2000/svg"
            x={isLeftPage ? minimumMargin + margins.left : pageData.svgWidth + holesMargin + margins.left}
            y={minimumMargin + margins.top}
            width={pageData.maxContentWidth}
            height={pageData.maxContentHeight}
            src={pageTemplate && pageTemplate.svg}
            suppressContentEditableWarning={true}
          />
        )}
      </>
    )
  }
}


export default PageSpread