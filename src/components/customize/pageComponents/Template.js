import React, { useEffect, useState, useCallback } from "react"

import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Blank from "../templates/Blank"
import Hexagon from "../templates/Hexagon"
import Isometric from "../templates/Isometric"
import Seyes from "../templates/Seyes"
import Music from "../templates/Music"
import Handwriting from "../templates/Handwriting"
import CrossGrid from "../templates/CrossGrid"
import Calligraphy from "../templates/Calligraphy"

function Template({
  currentPageSide,
  maxSvgSize,
  pageData,
  pagePosition,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
}) {
  const [node, setNode] = useState()

  const templateRef = useCallback(node => {
    if (node !== null) {
      setNode(node)
    }
  }, [])

  useEffect(() => {
    if (node) {
      setSelectedPageSvg(node)
      
      setTimeout(() => {
        const dimensions = node.getBBox()
        setSvgSize({
          height: dimensions.height,
          width: dimensions.width,
        })
      }, 10)
    }

  }, [pageData, pagePosition, node, maxSvgSize])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={templateRef}
      id={currentPageSide === "left" ? "left-page" : "right-page"}
      x={currentPageSide === "left" ? pagePosition.leftX : pagePosition.rightX}
      y={pagePosition.bothY}
      width={pageData.maxContentWidth}
      height={pageData.maxContentHeight}
      viewBox={`0 0 ${pageData.maxContentWidth} ${pageData.maxContentHeight}`}
      fill="#fff"
    >
      {pageData.template === "blank" && (
        <Blank
          pageData={pageData}
          maxSvgSize={maxSvgSize}
        />
      )}
      {pageData.template === "ruled" && (
        <Ruled
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "hexagon" && (
        <Hexagon
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "isometric" && (
        <Isometric
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "seyes" && (
        <Seyes
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "music" && (
        <Music
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "handwriting" && (
        <Handwriting
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGrid
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "calligraphy" && (
        <Calligraphy
          maxSvgSize={maxSvgSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
    </svg>
  )
}

export default Template