import React, { useEffect, useState, useRef } from "react"
import { colors, convertToPx } from "../../styles/variables"
import SVG from "react-inlinesvg"

import Template from "./pageComponents/Template"
import Holes from "./pageComponents/Holes"
import PageBackground from "./pageComponents/PageBackground"
import CoverPage from "./pageComponents/CoverPage"

function PageSpread({
  bookData,
  canvasPages,
  canvasPageTemplates,
  canvasPageSize,
  canvasSize,
  pageData,
  selectedPage,
  setPageContentSize,
  setPageData,
  setSelectedPageSvg,
}) {
  const [currentPageSide, setCurrentPageSide] = useState("")
  const [leftPage, setLeftPage] = useState([])
  const [rightPage, setRightPage] = useState([])
  const leftPageRef = useRef()
  const rightPageRef = useRef()
  const minimumMargin = convertToPx(3.175)
  const rightPageXPosition = canvasPageSize.width + convertToPx(10.16)
  const pageSpreadWidth = canvasPageSize.width * 2 // converted page spread width
  // the working area of the page (the part that accepts user input)
  const workingPageHeight = canvasPageSize.height - convertToPx(6.35) // minus top and bottom margins
  const workingPageWidth = canvasPageSize.width - convertToPx(13.335) // minus left and right margins

  useEffect(() => {
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
  }, [selectedPage])

  return (
    <svg
      id="page-spread"
      xmlns="http://www.w3.org/2000/svg"
      height={canvasPageSize.height + 2}
      width={canvasPageSize.width * 2 + 3}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y={(canvasSize.height - canvasPageSize.height) / 2}
    >
      <CoverPage
        bookData={bookData}
        canvasPageSize={canvasPageSize}
        selectedPage={selectedPage}
      />
      <Page
        bookData={bookData}
        canvasPageSize={canvasPageSize}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "left" ? true : false}
        minimumMargin={minimumMargin}
        pageData={pageData}
        pageRef={leftPageRef}
        pageSide="left"
        pageSvg={leftPage}
        rightPageXPosition={rightPageXPosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setPageContentSize={setPageContentSize}
        setSelectedPageSvg={setSelectedPageSvg}
        workingPageHeight={workingPageHeight}
        workingPageWidth={workingPageWidth}
      />
      <Page
        bookData={bookData}
        canvasPageSize={canvasPageSize}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        minimumMargin={minimumMargin}
        pageData={pageData}
        pageRef={rightPageRef}
        pageSide="right"
        pageSvg={rightPage}
        rightPageXPosition={rightPageXPosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setPageContentSize={setPageContentSize}
        setSelectedPageSvg={setSelectedPageSvg}
        workingPageHeight={workingPageHeight}
        workingPageWidth={workingPageWidth}
      />
    </svg>
  )
}

function Page({
  bookData,
  canvasPageSize,
  canvasPageTemplates,
  currentPageSide,
  isSelected,
  minimumMargin,
  pageData,
  pageRef,
  pageSide,
  pageSvg,
  rightPageXPosition,
  selectedPage,
  setPageData,
  setPageContentSize,
  setSelectedPageSvg,
  workingPageHeight,
  workingPageWidth,
}) {

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
          canvasPageSize={canvasPageSize}
          pageSide={pageSide}
        />
        {pageData.template && currentPageSide === pageSide ? (
          <Template
            bookData={bookData}
            canvasPageSize={canvasPageSize}
            currentPageSide={currentPageSide}
            minimumMargin={minimumMargin}
            pageData={pageData}
            rightPageXPosition={rightPageXPosition}
            setPageData={setPageData}
            setPageContentSize={setPageContentSize}
            setSelectedPageSvg={setSelectedPageSvg}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
          />
        ) : (
          <SVG
            xmlns="http://www.w3.org/2000/svg"
            ref={pageRef}
            height={workingPageHeight}
            width={workingPageWidth}
            viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
            id={pageSide === "left" ? "left-side-page" : "right-side-page"}
            x={pageSide === "left" ? minimumMargin : rightPageXPosition}
            y={minimumMargin}
            src={canvasPageTemplates[pageSvg]}
          />
        )}
      </>
    )
  }
}

export default PageSpread
