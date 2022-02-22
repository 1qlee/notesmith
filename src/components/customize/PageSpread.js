import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors, convertToPx } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import Ruled from "./Templates/Ruled"
import Dot from "./Templates/Dot"
import Graph from "./Templates/Graph"
import Blank from "./Templates/Blank"

function CoverPage({
  bookData,
  canvasPageHeight,
  canvasPageWidth,
  pageSide,
  selectedPage,
}) {

  if (selectedPage === 1) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={canvasPageHeight}
        width={canvasPageWidth}
        viewBox={`0 0 ${canvasPageWidth} ${canvasPageHeight}`}
        x="0"
        y="0"
      >
        <rect
          width={canvasPageWidth}
          height={canvasPageHeight}
          fill={colors.white}>
        </rect>
        <text
          x={(bookData.widthPixel / 2) - 80}
          y={bookData.heightPixel / 2}
          width={bookData.widthPixel}
          fill={colors.gray.nineHundred}
        >
          THIS IS THE COVER PAGE
        </text>
        <Holes
          currentPageSide="left"
          canvasPageWidth={canvasPageWidth}
          canvasPageHeight={canvasPageHeight}
        />
      </svg>
    )
  }
  else if (selectedPage === bookData.numOfPages) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={canvasPageHeight}
        width={canvasPageWidth}
        viewBox={`0 0 ${canvasPageWidth} ${canvasPageHeight}`}
        x="0"
        y="0"
      >
        <rect
          width={canvasPageWidth}
          height={canvasPageHeight}
          fill={colors.white}>
        </rect>
        <text
          x={(bookData.widthPixel / 2) - 80}
          y={bookData.heightPixel / 2}
          width={bookData.widthPixel}
          fill={colors.gray.nineHundred}
        >
          THIS IS THE COVER PAGE
        </text>
        <Holes
          currentPageSide="right"
          canvasPageWidth={canvasPageWidth}
          canvasPageHeight={canvasPageHeight}
        />
      </svg>
    )
  }
  else return null
}

function PageBackground({
  currentPageSide,
  canvasPageWidth,
  canvasPageHeight,
  isSelected,
  pageSide,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id={pageSide === "left" ? "page-background-left" : "page-background-right"}
      width={canvasPageWidth}
      height={canvasPageHeight}
      x={pageSide === "left" ? "1" : canvasPageWidth + 2}
      y="1"
      style={isSelected ? { outline: `1px solid ${colors.primary.sixHundred}` } : null}
    >
      <rect width={canvasPageWidth} height={canvasPageHeight - 2} fill={colors.white}></rect>
      <Holes currentPageSide={pageSide} canvasPageWidth={canvasPageWidth} canvasPageHeight={canvasPageHeight} />
    </svg>
  )
}

function Holes({
  currentPageSide,
  canvasPageHeight,
  canvasPageWidth
}) {
  const [holes, setHoles] = useState([])

  function generateHoles() {
    const holesArray = []
    const numOfHoles = (canvasPageHeight - 26) / 26 // page height minus the size of one hole incl margin divided by that same value
    const leftHolesXPosition = canvasPageWidth - 26
    const rightHolesXPosition = 10
    // for loop to generate appropriate number of holes for the page height
    for (let i = 0; i < numOfHoles; i++) {
      // hole property object
      const hole = {
        width: 15.12,
        height: 15.12,
        fill: colors.gray.oneHundred,
        strokeWidth: 1,
        stroke: colors.gray.threeHundred,
        x: currentPageSide === "left" ? leftHolesXPosition : rightHolesXPosition,
        y: 26 * i + 10
      }

      holesArray.push(hole)
    }

    setHoles(holesArray)
  }

  useEffect(() => {
    generateHoles()
  }, [])

  return (
    <g>
      {holes.map((hole, index) => (
        <rect
          key={`hole-${index}`}
          width={hole.width}
          height={hole.height}
          fill={hole.fill}
          x={hole.x}
          y={hole.y}
        >
        </rect>
      ))}
    </g>
  )
}

function Template({
  bookData,
  currentPageSide,
  pageData,
  setPageData,
  setSelectedPageSvg,
  workingPageHeight,
  workingPageWidth,
  rightPageXPosition,
  minimumMargin,
}) {
  const leftPageRef = useRef()
  const rightPageRef = useRef()

  useEffect(() => {
    if (currentPageSide === "left") {
      setSelectedPageSvg(leftPageRef.current)
    }
    else {
      setSelectedPageSvg(rightPageRef.current)
    }
  }, [])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={currentPageSide === "left" ? leftPageRef : rightPageRef}
      id={currentPageSide === "left" ? "left-side-page" : "right-side-page"}
      height={workingPageHeight}
      width={workingPageWidth}
      viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
      x={currentPageSide === "left" ? minimumMargin : rightPageXPosition}
      y={minimumMargin}
    >
      {pageData.template === "blank" && (
        <Blank
          pageData={pageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "ruled" && (
        <Ruled
          pageData={pageData}
          setPageData={setPageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          pageData={pageData}
          setPageData={setPageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          pageData={pageData}
          setPageData={setPageData}
          currentPageSide={currentPageSide}
        />
      )}
    </svg>
  )
}

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
  canvasPageHeight,
  canvasPageWidth,
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
          canvasPageHeight={canvasPageHeight}
          canvasPageWidth={canvasPageWidth}
          currentPageSide={currentPageSide}
          isSelected={isSelected}
          pageSide={pageSide}
        />
        {pageData.template ? (
          <Template
            bookData={bookData}
            currentPageSide={currentPageSide}
            pageData={pageData}
            rightPageXPosition={rightPageXPosition}
            setPageData={setPageData}
            setSelectedPageSvg={setSelectedPageSvg}
            workingPageHeight={workingPageHeight}
            workingPageWidth={workingPageWidth}
            minimumMargin={minimumMargin}
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
  canvasPages,
  canvasSize,
  pageData,
  bookData,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
}) {
  const { firebaseDb } = useFirebaseContext()
  const [currentPageSide, setCurrentPageSide] = useState("")
  const [leftPage, setLeftPage] = useState([])
  const [rightPage, setRightPage] = useState([])
  const [coverPage, setCoverPage] = useState({
    show: true,
    side: "left",
  })
  const leftPageRef = useRef()
  const rightPageRef = useRef()
  const canvasPageWidth = bookData.widthPixel
  const canvasPageHeight = bookData.heightPixel
  const minimumMargin = convertToPx(3.175)
  const leftPageXPosition = minimumMargin
  const rightPageXPosition = canvasPageWidth + convertToPx(9.525)
  const pageSpreadWidth = canvasPageWidth * 2 // converted page spread width
  // the working area of the page (the part that accepts user input)
  const workingPageHeight = canvasPageHeight - convertToPx(6.35) // minus top and bottom margins
  const workingPageWidth = canvasPageWidth - convertToPx(12.7) // minus left and right margins

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
    if (selectedPage % 2 === 0) {
      // set page side in state
      setCurrentPageSide("left")

      // if it's the last page, show only the left page
      if (selectedPage === bookData.numOfPages) {
        generateSvgs(canvasPages[selectedPage - 1].id, "left")
        setRightPage([])
      }
      // otherwise show the 2-page spread
      else {
        generateSvgs(canvasPages[selectedPage - 1].id, "left")
        generateSvgs(canvasPages[selectedPage].id, "right")
      }
    }
    // odd pages
    else {
      // set page side in state
      setCurrentPageSide("right")

      // if it's the first page, show only the right page
      if (selectedPage === 1) {
        generateSvgs(canvasPages[selectedPage - 1].id, "right")
        setLeftPage([])
      }
      // otherwise show the 2-page spread
      else {
        generateSvgs(canvasPages[selectedPage - 2].id, "left")
        generateSvgs(canvasPages[selectedPage - 1].id, "right")
      }
    }
  }, [selectedPage])

  return (
    <svg
      id="page-spread"
      xmlns="http://www.w3.org/2000/svg"
      width={canvasSize.width}
      height={canvasSize.height}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y={(canvasSize.height - canvasPageHeight) / 2}
    >
      <CoverPage
        bookData={bookData}
        canvasPageWidth={canvasPageWidth}
        canvasPageHeight={canvasPageHeight}
        selectedPage={selectedPage}
      />
      <Page
        bookData={bookData}
        canvasPageHeight={canvasPageHeight}
        canvasPageWidth={canvasPageWidth}
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
        setSelectedPageSvg={setSelectedPageSvg}
        workingPageHeight={workingPageHeight}
        workingPageWidth={workingPageWidth}
      />
      <Page
        bookData={bookData}
        canvasPageHeight={canvasPageHeight}
        canvasPageWidth={canvasPageWidth}
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
        setSelectedPageSvg={setSelectedPageSvg}
        workingPageHeight={workingPageHeight}
        workingPageWidth={workingPageWidth}
      />
    </svg>
  )
}

export default PageSpread
