import React, { useEffect, useState, useLayoutEffect, useRef, forwardRef } from "react"
import { pageMargins, convertToPx, convertFloatFixed } from "../../styles/variables"
import SVG from "react-inlinesvg"
import svgDragSelect from "svg-drag-select"

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
  const pageIndex = selectedPage - 1
  const pageIsEven = selectedPage % 2 === 0
  const pageId = canvasPages[pageIndex].pageId
  const currentPageSide = pageIsEven ? "left" : "right"
  const pageIsFrontCover = selectedPage === 1
  const pageIsBackCover = selectedPage === bookData.numOfPages
  const adjacentPageIndex = pageIsEven ? selectedPage + 1 : selectedPage - 1
  const adjacentPageId = !pageIsBackCover && canvasPages[adjacentPageIndex].pageId
  
  const leftPage = {
    index: pageIndex,
    id: pageId,
    side: currentPageSide,
    svg: pageIsEven ? canvasPageTemplates[pageId].svg : canvasPageTemplates[adjacentPageId].svg,
    margins: pageIsEven ? {
      top: convertToPx(canvasPageTemplates[pageId].marginTop),
      right: convertToPx(canvasPageTemplates[pageId].marginRight),
      bottom: convertToPx(canvasPageTemplates[pageId].marginBottom),
      left: convertToPx(canvasPageTemplates[pageId].marginLeft),
    } : {
      top: convertToPx(canvasPageTemplates[adjacentPageId].marginTop),
      right: convertToPx(canvasPageTemplates[adjacentPageId].marginRight),
      bottom: convertToPx(canvasPageTemplates[adjacentPageId].marginBottom),
      left: convertToPx(canvasPageTemplates[adjacentPageId].marginLeft),
    },
    isSelected: pageIsEven,
    htmlId: "left-template",
  }
  const rightPage = {
    index: pageIndex,
    id: pageId,
    side: currentPageSide,
    svg: !pageIsEven ? canvasPageTemplates[pageId].svg : canvasPageTemplates[adjacentPageId].svg,
    margins: !pageIsEven ? {
      top: convertToPx(canvasPageTemplates[pageId].marginTop),
      right: convertToPx(canvasPageTemplates[pageId].marginRight),
      bottom: convertToPx(canvasPageTemplates[pageId].marginBottom),
      left: convertToPx(canvasPageTemplates[pageId].marginLeft),
    } : {
      top: convertToPx(canvasPageTemplates[adjacentPageId].marginTop),
      right: convertToPx(canvasPageTemplates[adjacentPageId].marginRight),
      bottom: convertToPx(canvasPageTemplates[adjacentPageId].marginBottom),
      left: convertToPx(canvasPageTemplates[adjacentPageId].marginLeft),
    },
    isSelected: pageIsEven,
    htmlId: "right-template",
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
      {(pageIsFrontCover || pageIsBackCover) && (
        <CoverPage
          currentPageSide={currentPageSide}
          pageHeight={svgHeight}
          pageWidth={svgWidth}
        />
      )}
      {/* The left side page that is NOT a cover page */}
      {(!pageIsFrontCover && currentPageSide === "left") && (
        <Page
          canvasPageRef={pageIsEven ? canvasPageRef : null}
          maxSvgSize={maxSvgSize}
          page={leftPage}
          pageData={pageData}
          pagePosition={pagePosition}
          setPageData={setPageData}
          setSelectedPageSvg={setSelectedPageSvg}
          setSvgLoaded={setSvgLoaded}
          setSvgSize={setSvgSize}
        />
      )}
      {/* The right side page that is NOT a cover page */}
      {(!pageIsBackCover && currentPageSide === "right") && (
        <Page
          canvasPageRef={!pageIsEven ? canvasPageRef : null}
          maxSvgSize={maxSvgSize}
          page={rightPage}
          pageData={pageData}
          pagePosition={pagePosition}
          setPageData={setPageData}
          setSelectedPageSvg={setSelectedPageSvg}
          setSvgLoaded={setSvgLoaded}
          setSvgSize={setSvgSize}
        />
      )}
      <g id="selected-group"></g>
    </svg>
  )
}

const Page = ({
  canvasPageRef,
  maxSvgSize,
  page,
  pageData,
  pagePosition,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
  setSvgSize,
}) => {
  console.log(page)

  return (
    <>
      <PageBackground
        currentPageSide={page.side}
        isSelected={page.isSelected}
        pageHeight={pageData.svgHeight}
        pageWidth={pageData.svgWidth}
      />
      {pageData.template ? (
        <Template
          maxSvgSize={maxSvgSize}
          currentPageSide={page.side}
          pageData={pageData}
          pagePosition={pagePosition}
          setPageData={setPageData}
          setSelectedPageSvg={setSelectedPageSvg}
          setSvgSize={setSvgSize}
        />
      ) : (
        <SVG
          onLoad={() => {
            setSvgLoaded(true)
            console.log(`loaded page: ${page.htmlId}`)
          }}
          innerRef={canvasPageRef}
          id={page.htmlId}
          xmlns="http://www.w3.org/2000/svg"
          x={page.side === "left" ? minimumMargin + page.margins.left : pageData.svgWidth + pageMargins.holes + page.margins.left}
          y={minimumMargin + page.margins.top}
          width={pageData.maxContentWidth}
          height={pageData.maxContentHeight}
          src={page.svg}
        />
      )}
    </>
  )
}


export default PageSpread
