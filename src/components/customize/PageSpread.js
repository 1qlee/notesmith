import React, { useEffect, useState, useRef } from "react"
import { colors, convertToPx } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import Template from "./pageComponents/Template"
import Holes from "./pageComponents/Holes"
import PageBackground from "./pageComponents/PageBackground"
import CoverPage from "./pageComponents/CoverPage"

function PageSvg({
  currentPageSide,
  minimumMargin,
  pageData,
  pageRef,
  pageSide,
  pageSvg,
  rightPageXPosition,
  workingPageHeight,
  workingPageWidth,
}) {

  useEffect(() => {
  }, [])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={pageRef}
      height={workingPageHeight}
      width={workingPageWidth}
      viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
      id={pageSide === "left" ? "left-side-page" : "right-side-page"}
      x={pageSide === "left" ? minimumMargin : rightPageXPosition}
      y={minimumMargin}
    >
    {pageSvg.map((elem, index) => (
      <React.Fragment key={`${elem.name}-${index}`}>
        {elem.name === "circle" && (
          <circle
            cx={elem.cx}
            cy={elem.cy}
            opacity={elem.opacity}
            fill={elem.fill}
            r={elem.r}
          >
          </circle>
        )}
        {elem.name === "rect" && (
          <rect
            fill={elem.fill}
            width={elem.width}
            height={elem.height}
          >
          </rect>
        )}
        {elem.name === "line" && (
          <line
            fill={elem.fill}
            stroke={elem.stroke}
            strokeWidth={elem.strokeWidth}
            opacity={elem.opacity}
            x1={elem.x1}
            x2={elem.x2}
            y1={elem.y1}
            y2={elem.y2}
          >
          </line>
        )}
      </React.Fragment>
    ))}
    </svg>
  )
}

function Page({
  bookData,
  canvasPageSize,
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
          <PageSvg
            currentPageSide={currentPageSide}
            minimumMargin={minimumMargin}
            pageData={pageData}
            pageRef={pageRef}
            pageSide={pageSide}
            pageSvg={pageSvg}
            rightPageXPosition={rightPageXPosition}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
          />
        )}
      </>
    )
  }
}

function PageSpread({
  bookData,
  canvasPages,
  canvasPageSize,
  canvasSize,
  pageData,
  selectedPage,
  setPageContentSize,
  setPageData,
  setSelectedPageSvg,
}) {
  const { firebaseDb } = useFirebaseContext()
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

  // get the page from the db and push its svg elements into an array
  async function generateSvgs(pageId, pageSide) {
    // hold svg elements in an array
    const svgArray = []
    // wait for db to return values
    await firebaseDb.ref(`pages/${pageId}/svg`).once("value").then(snapshot => {
      snapshot.forEach(svgElem => {
        const elem = svgElem.val()
        // push each element into dummy array
        svgArray.push(elem)
      })
    })

    // based on pageSide arg, set corresponding page side's state as svgArray
    if (pageSide === "left") {
      setLeftPage(svgArray)
    }
    else {
      setRightPage(svgArray)
    }
  }

  useEffect(() => {
    // even pages
    // if (selectedPage % 2 === 0) {
    //   // set page side in state
    //   setCurrentPageSide("left")
    //
    //   // if it's the last page, show only the left page
    //   if (selectedPage === bookData.numOfPages) {
    //     generateSvgs(canvasPages[selectedPage - 1].pageId, "left")
    //     setRightPage([])
    //   }
    //   // otherwise show the 2-page spread
    //   else {
    //     generateSvgs(canvasPages[selectedPage - 1].pageId, "left")
    //     generateSvgs(canvasPages[selectedPage].pageId, "right")
    //   }
    // }
    // // odd pages
    // else {
    //   // set page side in state
    //   setCurrentPageSide("right")
    //
    //   // if it's the first page, show only the right page
    //   if (selectedPage === 1) {
    //     generateSvgs(canvasPages[selectedPage - 1].pageId, "right")
    //     setLeftPage([])
    //   }
    //   // otherwise show the 2-page spread
    //   else {
    //     generateSvgs(canvasPages[selectedPage - 2].pageId, "left")
    //     generateSvgs(canvasPages[selectedPage - 1].pageId, "right")
    //   }
    // }
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

export default PageSpread
