import React, { useEffect, useState, useCallback } from "react"
import { convertToPx } from "../../../styles/variables"

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
  contentSize,
  pageData,
  pagePosition,
  setPageData,
  setSelectedPageSvg,
}) {
  const [node, setNode] = useState()

  const mRef = useCallback(node => {
    if (node !== null) {
      setNode(node)
    }
  }, [pageData])

  useEffect(() => {
    if (node) {
      setSelectedPageSvg(node)
      
      setTimeout(() => {
        const dimensions = node.getBBox()
        // setPageSize({
        //   height: dimensions.height,
        //   width: dimensions.width,
        // })
      }, 10)
    }

  }, [pageData, node, pagePosition, contentSize])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={mRef}
      id={currentPageSide === "left" ? "left-page" : "right-page"}
      x={currentPageSide === "left" ? pagePosition.leftX : pagePosition.rightX}
      y={pagePosition.bothY}
      width={pageData.svgContentWidth}
      height={pageData.svgContentHeight}
      fill="#fff"
    >
      {pageData.template === "blank" && (
        <Blank
          pageData={pageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "ruled" && (
        <Ruled
          contentSize={contentSize}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "hexagon" && (
        <Hexagon
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "isometric" && (
        <Isometric
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "seyes" && (
        <Seyes
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "music" && (
        <Music
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "handwriting" && (
        <Handwriting
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGrid
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "calligraphy" && (
        <Calligraphy
          currentPageSide={currentPageSide}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
    </svg>
  )
}

export default Template
