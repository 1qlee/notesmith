import React from "react"
import styled from "styled-components"

import Ruled from "../customize/templates/Ruled"
import Dot from "../customize/templates/Dot"
import Graph from "../customize/templates/Graph"
import Blank from "../customize/templates/Blank"
import Hexagon from "../customize/templates/Hexagon"
import Isometric from "../customize/templates/Isometric"
import Seyes from "../customize/templates/Seyes"
import Music from "../customize/templates/Music"
import Handwriting from "../customize/templates/Handwriting"
import CrossGrid from "../customize/templates/CrossGrid"
import Calligraphy from "../customize/templates/Calligraphy"

const StyledDemoTemplate = styled.div`
  position: absolute;
  top: 12px;
  left: 58px;
  z-index: 5;
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
        height={pageData.pageHeight}
        width={pageData.pageWidth}
        x="0"
        y="0"
      >
        {pageData.template === "blank" && (
          <></>
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
        {pageData.template === "crossgrid" && (
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