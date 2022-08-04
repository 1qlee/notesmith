import React from "react"
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
  borderData,
  dashedLineData,
  pageData,
  setPageData,
}) {
  return (
    <StyledDemoTemplate>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        x="0"
        y="0"
      >
        {pageData.template === "blank" && (
          null
        )}
        {pageData.template === "ruled" && (
          <Ruled
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "dot" && (
          <Dot
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "graph" && (
          <Graph
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "hexagon" && (
          <Hexagon
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "isometric" && (
          <Isometric
            borderData={borderData}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "seyes" && (
          <Seyes
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "music" && (
          <Music
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "handwriting" && (
          <Handwriting
            dashedLineData={dashedLineData}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "cross" && (
          <CrossGrid
            dashedLineData={dashedLineData}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "calligraphy" && (
          <Calligraphy
            dashedLineData={dashedLineData}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
      </svg>
    </StyledDemoTemplate>
  )
}

export default DemoTemplate