import React, { useEffect, useState, useLayoutEffect, useRef, forwardRef } from "react"
import { pageMargins, convertToPx, convertFloatFixed } from "../../styles/variables"
import SVG from "react-inlinesvg"
import svgDragSelect from "svg-drag-select"
import useRefCallback from "../../hooks/useRefCallback"

import Template from "./pageComponents/Template"
import PageBackground from "./pageComponents/PageBackground"
import CoverPage from "./pageComponents/CoverPage"

const minimumMargin = pageMargins.minimum

function PageSpread({
  bookData,
  canvasPages,
  canvasPageTemplates,
  canvasSize,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
}) {
  const [svgLoaded, setSvgLoaded] = useState(false)
  const canvasRef = useRef(null)
  const canvasPageRef = useRef(null)
  const { svgWidth, svgHeight, marginTop, marginRight, marginBottom, marginLeft } = pageData
  const margin = {
    top: convertToPx(marginTop),
    right: convertToPx(marginRight),
    bottom: convertToPx(marginBottom),
    left: convertToPx(marginLeft),
  }
  const pagePosition = {
    rightX: svgWidth + pageMargins.holes + margin.left,
    leftX: minimumMargin + margin.left,
    bothY: minimumMargin + margin.top,
    spreadX: (canvasSize.width - svgWidth * 2) / 2,
    spreadY: (canvasSize.height - svgHeight) / 2,
  }
  const maxSvgSize = {
    height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
    width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
  }
  const currentPage = selectedPage - 1
  const pageIsEven = selectedPage % 2 === 0
  let currentPageSide = pageIsEven ? "left" : "right"
  let rightPage, leftPage

  if (pageIsEven) {
    console.log("even page", selectedPage)
    // if it's the last page, show only the left page
    if (selectedPage === bookData.numOfPages) {
      leftPage = canvasPages[currentPage].pageId 
      rightPage = null
    }
    // otherwise show the 2-page spread
    else {
      leftPage = canvasPages[currentPage].pageId 
      rightPage = canvasPages[currentPage + 1].pageId 
    }
  }
  // odd pages
  else {
    console.log("odd page", selectedPage)
    // if it's the first page, show only the right page
    if (selectedPage === 1) {
      rightPage = canvasPages[currentPage].pageId 
      leftPage = null 
    }
    // otherwise show the 2-page spread
    else {
      leftPage = canvasPages[currentPage - 1].pageId 
      rightPage = canvasPages[currentPage].pageId 
    }
  }

  useEffect(() => {
    console.log(canvasPageRef)
    console.log(pageIsEven)
    if (canvasPageRef.current === null) {
      console.log("null")
    }
    if (svgLoaded) {
      console.log("loaded")
      const canvas = canvasRef.current

      const {
        cancel,           // cleanup function.
        // please call `cancel()` when the select-on-drag behavior is no longer needed.
        dragAreaOverlay,  // a div element overlaying dragging area.
        // you can customize the style of this element.
        // this element has "svg-drag-select-area-overlay" class by default.
      } = svgDragSelect({
        // the svg element (required).
        svg: canvas,
        // followings are optional parameters with default values.
        referenceElement: canvasPageRef.current,     // selects only descendants of this SVGElement if specified.
        selector: "intersection",      // "enclosure": selects enclosed elements using getEnclosureList().
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
          // for example: clear "data-selected" attribute
          const selectedElements = svg.querySelectorAll('[data-selected]')
          for (let i = 0; i < selectedElements.length; i++) {
            selectedElements[i].removeAttribute('data-selected')
          }
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
          // for example: toggle "data-selected" attribute
          newlyDeselectedElements.forEach(element => element.removeAttribute('data-selected'))
          newlySelectedElements.forEach(element => element.setAttribute('data-selected', ''))
        },

        onSelectionEnd({
          svg,                      // the svg element.
          pointerEvent,             // a `PointerEvent` instance with either a "pointerup" event or a "pointercancel" event.
          // (in case of Safari, a `MouseEvent` or a `TouchEvent` is used instead.)
          selectedElements,         // selected element array.
        }) {
        },
      })

      return () => {
        cancel()
      }
    }
  }, [pageData, canvasSize, selectedPage, canvasPages, canvasPageTemplates, canvasPageRef.current, svgLoaded])

  return (
    <svg
      ref={canvasRef}
      id="page-spread"
      xmlns="http://www.w3.org/2000/svg"
      xlinkns="http://www.w3.org/1999/xlink"
      height={svgHeight + 2}
      width={svgWidth * 2 + 3}
      x={pagePosition.spreadX}
      y={pagePosition.spreadY}
    >
      <CoverPage
        bookData={bookData}
        selectedPage={selectedPage}
        pageHeight={svgHeight}
        pageWidth={svgWidth}
      />
      <Page
        bookData={bookData}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={pageIsEven ? true : false}
        maxSvgSize={maxSvgSize}
        pageData={pageData}
        pageSide="left"
        pageId={leftPage}
        pagePosition={pagePosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
        setSvgLoaded={setSvgLoaded}
        canvasPageRef={pageIsEven ? canvasPageRef : null}
      />
      <Page
        bookData={bookData}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        maxSvgSize={maxSvgSize}
        pageData={pageData}
        pageSide="right"
        pageId={rightPage}
        pagePosition={pagePosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
        setSvgLoaded={setSvgLoaded}
        canvasPageRef={!pageIsEven ? canvasPageRef : null}
      />
      <g id="selected-group"></g>
    </svg>
  )
}

const Page = ({
  bookData,
  canvasPageTemplates,
  canvasPageRef,
  currentPageSide,
  isSelected,
  maxSvgSize,
  pagePosition,
  pageData,
  pageSide,
  pageId,
  selectedPage,
  setSvgLoaded,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
}) => {
  const isLeftPage = pageSide === "left"
  const pageSvg = canvasPageTemplates[pageId]
  let margins = {
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
  }
  if (pageSvg) {
    margins = {
      top: convertFloatFixed(convertToPx(pageSvg.marginTop), 3),
      right: convertFloatFixed(convertToPx(pageSvg.marginRight), 3),
      bottom: convertFloatFixed(convertToPx(pageSvg.marginBottom), 3),
      left: convertFloatFixed(convertToPx(pageSvg.marginLeft), 3),
    }
  }

  if (selectedPage === 1 && pageSide === "left") {
    console.log("front cover")
    return null
  }
  else if (selectedPage === bookData.numOfPages && pageSide === "right") {
    console.log("back cover")
    return null
  }
  else {
    console.log(`page ${selectedPage} ${pageSide}`)
    return (
      <>
        <PageBackground
          currentPageSide={currentPageSide}
          isSelected={isSelected}
          pageHeight={pageData.svgHeight}
          pageWidth={pageData.svgWidth}
          pageSide={pageSide}
        />
        {pageData.template && currentPageSide === pageSide ? (
          <Template
            bookData={bookData}
            maxSvgSize={maxSvgSize}
            currentPageSide={currentPageSide}
            pageData={pageData}
            pagePosition={pagePosition}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            setSvgSize={setSvgSize}
          />
        ) : (
          <SVG
            onLoad={() => setSvgLoaded(true)}
            innerRef={canvasPageRef}
            id={isLeftPage ? "left-template" : "right-template"}
            xmlns="http://www.w3.org/2000/svg"
            x={isLeftPage ? minimumMargin + margins.left : pageData.svgWidth + pageMargins.holes + margins.left}
            y={minimumMargin + margins.top}
            width={pageData.maxContentWidth}
            height={pageData.maxContentHeight}
            src={pageSvg.svg}
          />
        )}
      </>
    )
  }
}


export default PageSpread
