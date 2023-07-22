import React, { useEffect, useState, useRef } from "react"
import { pageMargins, convertToPx } from "../../styles/variables"
import SVG from "react-inlinesvg"
import svgDragSelect from "svg-drag-select"
import { useEditorContext, useEditorDispatch } from './context/editorContext'
import { SVG as svgJs } from "@svgdotjs/svg.js"

import Template from "./pageComponents/Template"
import PageBackground from "./pageComponents/PageBackground"
import CoverPage from "./pageComponents/CoverPage"

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
  const pageIsLeft = selectedPage % 2 === 0
  const pagePosition = {
    x: pageIsLeft ? minimumMargin + convertToPx(marginLeft) : svgWidth + holesMargin + convertToPx(marginLeft),
    y: minimumMargin + convertToPx(marginTop),
    spreadX: (canvasSize.width - svgWidth * 2) / 2,
    spreadY: (canvasSize.height - svgHeight) / 2,
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
  let margins = {
    top: 12,
    right: 0,
    bottom: 0,
    left: 12,
  }
  pageIsLeft ? margins = {
    top: convertToPx(leftPageTemplate.marginTop),
    right: convertToPx(leftPageTemplate.marginRight),
    bottom: convertToPx(leftPageTemplate.marginBottom),
    left: convertToPx(leftPageTemplate.marginLeft),
  } : margins = {
    top: convertToPx(rightPageTemplate.marginTop),
    right: convertToPx(rightPageTemplate.marginRight),
    bottom: convertToPx(rightPageTemplate.marginBottom),
    left: convertToPx(rightPageTemplate.marginLeft),
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

    console.log(selectedPage)
    console.log(svgLoaded)

    if (svgLoaded === selectedPage && canvasPageRef.current) {
      console.log("Svg loaded: ", svgLoaded)
      console.log(canvasPageRef.current)
      dispatch({
        type: "init",
        margins: margins,
        position: pagePosition,
        canvas: svgJs(canvasPageRef.current),
        parent: svgJs(canvasRef.current),
      })
      referenceElement = canvasPageRef.current
    }

    if (canvasState.mode === "select" && svgLoaded) {
      console.log(referenceElement)
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
          dispatch({
            type: "change-selection",
            selectedElements: selectedElements,
          })
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
  }, [canvasPageRef, svgLoaded, selectedPage, selectedPageSvg])

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
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "left" ? true : false}
        margins={margins}
        pageData={pageData}
        pageId={leftPage}
        pagePosition={pagePosition}
        pageSide="left"
        pageTemplate={leftPageTemplate}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgLoaded={setSvgLoaded}
        setSvgSize={setSvgSize}
      />
      <Page
        bookData={bookData}
        canvasPageRef={canvasPageRef}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        margins={margins}
        pageData={pageData}
        pageId={leftPage}
        pagePosition={pagePosition}
        pageSide="right"
        pageTemplate={rightPageTemplate}
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
  currentPageSide,
  isSelected,
  margins,
  pageData,
  pagePosition,
  pageSide,
  pageTemplate,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgLoaded,
  setSvgSize,
}) {
  const maxSvgSize = {
    height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
    width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
  }
  const isLeftPage = pageSide === "left"

  useEffect(() => {
    if (isSelected) {
      setSvgLoaded(selectedPage)
    }
  }, [selectedPage])

  const handleSvgLoad = (src) => {
    if (src && isSelected) {
      console.log("svg source is set, setting svg loaded to: ", selectedPage)
      console.log(canvasPageRef)
      setSvgLoaded(selectedPage)
    }
  }

  if (selectedPage === 1 && pageSide === "left") {
    console.log("Rendering front cover")
    return null
  }
  else if (selectedPage === bookData.numOfPages && pageSide === "right") {
    console.log("Rendering back cover")
    return null
  }
  else {
    console.log("Rendering SVG page")
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
            innerRef={isSelected ? canvasPageRef : null}
            onLoad={(src) => handleSvgLoad(src)}
            id={isLeftPage ? "left-page" : "right-page"}
            xmlns="http://www.w3.org/2000/svg"
            x={isLeftPage ? minimumMargin + margins.left : pageData.svgWidth + holesMargin + margins.left}
            y={minimumMargin + margins.top}
            width={pageData.maxContentWidth}
            height={pageData.maxContentHeight}
            src={pageTemplate && pageTemplate.svg}
          />
        )}
      </>
    )
  }
}


export default PageSpread