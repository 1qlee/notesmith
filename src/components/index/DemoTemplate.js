import React, { forwardRef } from "react"
import styled from "styled-components"

import Ruled from "../customize/templates/Ruled"
import Dot from "../customize/templates/Dot"
import Graph from "../customize/templates/Graph"
import Hexagon from "../customize/templates/Hexagon"
import Isometric from "../customize/templates/Isometric"
import Seyes from "../customize/templates/Seyes"
import Music from "../customize/templates/Music"
import Handwriting from "../customize/templates/Handwriting"
import CrossGrid from "../customize/templates/CrossGrid"
import Calligraphy from "../customize/templates/Calligraphy"

const StyledDemoTemplate = styled.div`
  position: absolute;
  top: 1.9%;
  left: 13.2%;
  z-index: 5;
  width: 84%;
  height: 96%;
`

function DemoTemplate({
  pageDimensions,
  pageData,
  setPageData,
}) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={pageDimensions.height}
      width={pageDimensions.width}
      fill="#fff"
      x="0"
      y="0"
    >
      {pageData.template === "blank" && (
        null
      )}
      {pageData.template === "ruled" && (
        <Ruled
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "hexagon" && (
        <Hexagon
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "isometric" && (
        <Isometric
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "seyes" && (
        <Seyes
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "music" && (
        <Music
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "handwriting" && (
        <Handwriting
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGrid
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "calligraphy" && (
        <Calligraphy
          maxSvgSize={pageDimensions}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
    </svg>
  )
}

export default DemoTemplate