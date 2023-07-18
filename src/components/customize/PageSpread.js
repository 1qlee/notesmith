import React, { useEffect, useState, useLayoutEffect, useRef, forwardRef } from "react"
import { pageMargins, convertToPx, convertFloatFixed } from "../../styles/variables"
import SVG from "react-inlinesvg"
import svgDragSelect from "svg-drag-select"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import { SVG as svgJs } from "@svgdotjs/svg.js"

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
  selectedPageSvg,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
}) {
  const canvasRef = useRef(null)
  const canvasPageRef = useRef(null)
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const [svgLoaded, setSvgLoaded] = useState(false)
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
  let currentPageSide = "right"
  let leftPage = null
  let rightPage = null
  
  if (selectedPage % 2 === 0) {
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


  useEffect(() => {
    let referenceElement = null

    if (pageData.template && selectedPageSvg) {
      console.log("Rendering template component.")
      // dispatch({
      //   type: "init",
      //   canvas: selectedPageSvg,
      // })
      referenceElement = selectedPageSvg
    }

    if (svgLoaded && canvasPageRef) {
      console.log("Rendering canvas page.")
      dispatch({
        type: "init",
        canvas: svgJs(canvasPageRef.current),
      })
      referenceElement = canvasPageRef.current
    }

    if (canvasState.mode === "select") {
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

          dispatch({
            type: "ungroup-selection",
            id: "selected-group",
          })

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
          if (selectedElements.length > 0) {
            dispatch({
              type: "change-selection",
              selectedElements: selectedElements,
            })
          }
          // for example: toggle "data-selected" attribute
          newlyDeselectedElements.forEach(element => element.removeAttribute('data-selected'))
          newlySelectedElements.forEach(element => {
            if (element.getAttribute("id") !== "selection-path") {
              element.setAttribute('data-selected', '')
            }
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
  }, [canvasPageRef, svgLoaded, canvasState.mode])

  return (
    <svg
      id="page-spread"
      ref={canvasRef}
      xmlns="http://www.w3.org/2000/svg"
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
        canvasPageRef={canvasPageRef}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "left" ? true : false}
        pageData={pageData}
        pageSide="left"
        pageId={leftPage}
        pagePosition={pagePosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
        setSvgLoaded={setSvgLoaded}
      />
      <Page
        bookData={bookData}
        canvasPageRef={canvasPageRef}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        pageData={pageData}
        pageSide="right"
        pageId={rightPage}
        pagePosition={pagePosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
        setSvgLoaded={setSvgLoaded}
      />
    </svg>
  )
}

function Page({
  bookData,
  canvasPageRef,
  canvasPageTemplates,
  currentPageSide,
  isSelected,
  pageData,
  pagePosition,
  pageSide,
  pageId,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  setSvgLoaded,
}) {
  const [loaded, setLoaded] = useState(false)
  const maxSvgSize = {
    height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
    width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
  }
  const isLeftPage = pageSide === "left"

  useEffect(() => {
    console.log("page rendered")

    if (isSelected && loaded) {
      console.log(`Loaded template for ${currentPageSide} page.`)
      setSvgLoaded(canvasPageRef.current)
    }

  }, [pageId, canvasPageTemplates, selectedPage, isSelected, loaded])

  if (selectedPage === 1 && pageSide === "left") {
    return null
  }
  else if (selectedPage === bookData.numOfPages && pageSide === "right") {
    return null
  }
  else {
    let pageTemplate = {}
    let margins = {
      top: 12,
      right: 0,
      bottom: 0,
      left: 12,
    }

    if (canvasPageTemplates && pageId) {
      pageTemplate = canvasPageTemplates[pageId]

      margins = {
        top: convertToPx(pageTemplate.marginTop),
        right: convertToPx(pageTemplate.marginRight),
        bottom: convertToPx(pageTemplate.marginBottom),
        left: convertToPx(pageTemplate.marginLeft),
      }
    }
      
    return (
      <>
        <PageBackground
          currentPageSide={currentPageSide}
          isSelected={isSelected}
          pageHeight={pageData.svgHeight}
          pageWidth={pageData.svgWidth}
          pageSide={pageSide}
        />
        {pageData.template && isSelected ? (
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
            innerRef={isSelected && canvasPageRef}
            onLoad={() => setLoaded(true)}
            id={isLeftPage ? "left-template" : "right-template"}
            xmlns="http://www.w3.org/2000/svg"
            x={isLeftPage ? minimumMargin + margins.left : pageData.svgWidth + pageMargins.holes + margins.left}
            y={minimumMargin + margins.top}
            width={pageData.maxContentWidth}
            height={pageData.maxContentHeight}
            src={(canvasPageTemplates && pageId) && canvasPageTemplates[pageId].svg}
          />
        )}
      </>
    )
  }
}


export default PageSpread