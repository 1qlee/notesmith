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
  const [maxSvgSize, setMaxSvgSize] = useState()
  const [currentPageSide, setCurrentPageSide] = useState("")
  const [leftPage, setLeftPage] = useState("")
  const [rightPage, setRightPage] = useState("")
  const [pagePosition, setPagePosition] = useState({})

  useEffect(() => {
    let svgPage
    // even pages
    if (selectedPage % 2 === 0) {
      // set page side in state
      setCurrentPageSide("left")

      // if it's the last page, show only the left page
      if (selectedPage === bookData.numOfPages) {
        setLeftPage(canvasPages[selectedPage - 1].pageId)
        setRightPage(null)
      }
      // otherwise show the 2-page spread
      else {
        setLeftPage(canvasPages[selectedPage - 1].pageId)
        setRightPage(canvasPages[selectedPage].pageId)
      }
    }
    // odd pages
    else {
      // set page side in state
      setCurrentPageSide("right")

      // if it's the first page, show only the right page
      if (selectedPage === 1) {
        setRightPage(canvasPages[selectedPage - 1].pageId)
        setLeftPage(null)
      }
      // otherwise show the 2-page spread
      else {
        setLeftPage(canvasPages[selectedPage - 2].pageId)
        setRightPage(canvasPages[selectedPage - 1].pageId)
      }
    }

    const margin = {
      top: convertToPx(marginTop),
      right: convertToPx(marginRight),
      bottom: convertToPx(marginBottom),
      left: convertToPx(marginLeft),
    }

    setPagePosition({
      rightX: svgWidth + pageMargins.holes + margin.left,
      leftX: minimumMargin + margin.left,
      bothY: minimumMargin + margin.top,
      spreadX: (canvasSize.width - svgWidth * 2) / 2,
      spreadY: (canvasSize.height - svgHeight) / 2,
    })

    setMaxSvgSize({
      height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
      width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
    })

    if (canvasState.mode === "select" && svgLoaded) {
      dispatch({
        type: "init",
        canvas: svgJs(canvasPageRef.current),
      })

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
        referenceElement: pageData.template ? selectedPageSvg : canvasPageRef.current,     // selects only descendants of this SVGElement if specified.
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
          // create an svg group to temporarily contain the selected elements
          const group = canvasState.canvas.group()
          // add selected elements to state
          dispatch({
            type: "select",
            selectedElements: selectedElements,
          })

          dispatch({

          })
          
          if (selectedElements.length > 1) {
            selectedElements.forEach(element => {
              group.add(element)
            })
          }

          console.log(group.bbox())
        },
      })

      return () => {
        cancel()
      }
    }
  }, [pageData, canvasSize, selectedPage, canvasPages, canvasPageTemplates, canvasPageRef.current, svgLoaded])

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
      <div id="page-spread"></div>
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
      />
      <Page
        bookData={bookData}
        canvasPageRef={canvasPageRef}
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
      />
    </svg>
  )
}

function Page({
  bookData,
  canvasPageTemplates,
  currentPageSide,
  isSelected,
  maxSvgSize,
  pageData,
  pagePosition,
  pageSide,
  pageId,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  setSvgLoaded,
  canvasPageRef,
}) {
  const [pageSvg, setPageSvg] = useState({
    svg: `<svg><rect width="477.6" height="792" fill="white"></rect></svg>`,
    marginTop: 12,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 12,
  })
  const isLeftPage = pageSide === "left"
  const margins = {
    top: convertFloatFixed(convertToPx(pageSvg.marginTop), 3),
    right: convertFloatFixed(convertToPx(pageSvg.marginRight), 3),
    bottom: convertFloatFixed(convertToPx(pageSvg.marginBottom), 3),
    left: convertFloatFixed(convertToPx(pageSvg.marginLeft), 3),
  }

  useEffect(() => {
    if (canvasPageTemplates && pageId) {
      const template = canvasPageTemplates[pageId]
      setPageSvg(template)
    }

    if (isSelected) {
      setSvgLoaded(canvasPageRef.current)
    }
  }, [pageId, canvasPageTemplates, currentPageSide, selectedPage, isSelected])

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
        />
        {pageData.template && currentPageSide === pageSide ? (
          <Template
            ref={canvasPageRef}
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