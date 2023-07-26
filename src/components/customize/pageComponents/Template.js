import React, { useCallback } from "react"

import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Hexagon from "../templates/Hexagon"
import Isometric from "../templates/Isometric"
import Seyes from "../templates/Seyes"
import Music from "../templates/Music"
import Handwriting from "../templates/Handwriting"
import CrossGrid from "../templates/CrossGrid"
import Calligraphy from "../templates/Calligraphy"

const Template = ({
  currentPageSide,
  maxSvgSize,
  pageData,
  pagePosition,
  setPageData,
  setSelectedPageSvg,
  setSvgSize,
  setSvgLoaded,
}) => {

  const templateRef = useCallback(node => {
    if (node !== null) {
      setSvgLoaded(null)
      setSelectedPageSvg(node)
      const dimensions = node.getBBox()

      setTimeout(() => {
        setSvgSize({
          height: dimensions.height,
          width: dimensions.width,
        })
      }, 10)

    }
  }, [pageData])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={templateRef}
      id={currentPageSide === "left" ? "left-page" : "right-page"}
      x={pagePosition.x}
      y={pagePosition.y}
      width={pageData.maxContentWidth}
      height={pageData.maxContentHeight}
      viewBox={`0 0 ${pageData.maxContentWidth} ${pageData.maxContentHeight}`}
      fill="#fff"
    >
      {pageData.template === "blank" && (
        null
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
