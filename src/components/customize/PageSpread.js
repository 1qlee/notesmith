import React, { useEffect, useState } from "react"
import { pageMargins, convertToPx } from "../../styles/variables"
import SVG from "react-inlinesvg"

import Template from "./pageComponents/Template"
import PageBackground from "./pageComponents/PageBackground"
import CoverPage from "./pageComponents/CoverPage"

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
  const { svgWidth, svgHeight, marginTop, marginRight, marginBottom, marginLeft } = pageData
  const minimumMargin = pageMargins.minimum
  const [maxSvgSize, setMaxSvgSize] = useState()
  const [currentPageSide, setCurrentPageSide] = useState("")
  const [leftPage, setLeftPage] = useState([])
  const [rightPage, setRightPage] = useState([])
  const [pagePosition, setPagePosition] = useState({})

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

    const margin = {
      top: convertToPx(marginTop),
      right: convertToPx(marginRight),
      bottom: convertToPx(marginBottom),
      left: convertToPx(marginLeft),
    }

    setPagePosition({
      rightX: svgWidth + convertToPx(10.16) + margin.left,
      leftX: minimumMargin + margin.left,
      bothY: minimumMargin + margin.top,
      spreadX: (canvasSize.width - svgWidth * 2) / 2,
      spreadY: (canvasSize.height - svgHeight) / 2,
    })

    setMaxSvgSize({
      height: pageData.maxContentHeight - convertToPx(pageData.marginTop) - convertToPx(pageData.marginBottom),
      width: pageData.maxContentWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight),
    })
  }, [pageData, canvasSize, selectedPage, canvasPages, canvasPageTemplates])

  return (
    <svg
      id="page-spread"
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
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "left" ? true : false}
        maxSvgSize={maxSvgSize}
        pageData={pageData}
        pageSide="left"
        pageSvg={leftPage}
        pagePosition={pagePosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
      />
      <Page
        bookData={bookData}
        canvasPageTemplates={canvasPageTemplates}
        currentPageSide={currentPageSide}
        isSelected={currentPageSide === "right" ? true : false}
        maxSvgSize={maxSvgSize}
        pageData={pageData}
        pageSide="right"
        pageSvg={rightPage}
        pagePosition={pagePosition}
        selectedPage={selectedPage}
        setPageData={setPageData}
        setSelectedPageSvg={setSelectedPageSvg}
        setSvgSize={setSvgSize}
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
  pageSvg,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
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
            xmlns="http://www.w3.org/2000/svg"
            x={pageSide === "left" ? pagePosition.leftX : pagePosition.rightX}
            y={pagePosition.bothY}
            width={pageData.maxContentWidth}
            height={pageData.maxContentHeight}
            src={canvasPageTemplates[pageSvg]}
          />
        )}
      </>
    )
  }
}

export default PageSpread
