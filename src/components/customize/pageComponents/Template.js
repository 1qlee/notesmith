import React, { useRef, useEffect } from "react"
import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Blank from "../templates/Blank"

function Template({
  bookData,
  currentPageSide,
  minimumMargin,
  pageData,
  rightPageXPosition,
  setPageData,
  setSelectedPageSvg,
  workingPageHeight,
  workingPageWidth,
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

export default Template
