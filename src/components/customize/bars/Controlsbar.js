import React from "react"
import styled from "styled-components"
import { convertToMM, convertFloatFixed } from "../../../styles/variables"

import DotControls from "../templateControls/DotControls"
import RuledControls from "../templateControls/RuledControls"
import GraphControls from "../templateControls/GraphControls"
import HexagonControls from "../templateControls/HexagonControls"
import IsometricControls from "../templateControls/IsometricControls"
import SeyesControls from "../templateControls/SeyesControls"
import MusicControls from "../templateControls/MusicControls"
import HandwritingControls from "../templateControls/HandwritingControls"
import CrossGridControls from "../templateControls/CrossGridControls"
import CalligraphyControls from "../templateControls/CalligraphyControls"

const StyledControlsBar = styled.div`
  height: 100%;
  width: 100%;
`

function Controlsbar({
  pageData,
  setPageData,
  svgSize,
}) {
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.svgHeight) - pageData.thickness, 3)
  const maximumMarginWidth = convertFloatFixed(convertToMM(pageData.svgWidth), 3)
 
  return (
    <StyledControlsBar>
      {pageData.template !== "blank" && pageData.template !== "none" && (
        <>
          {pageData.template === "ruled" && (
            <RuledControls
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
              svgSize={svgSize}
            />
          )}
          {pageData.template === "dot" && (
            <DotControls
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
              svgSize={svgSize}
            />
          )}
          {pageData.template === "graph" && (
            <GraphControls
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
              svgSize={svgSize}
            />
          )}
          {pageData.template === "hexagon" && (
            <HexagonControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "isometric" && (
            <IsometricControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "seyes" && (
            <SeyesControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "music" && (
            <MusicControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "handwriting" && (
            <HandwritingControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "cross" && (
            <CrossGridControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "calligraphy" && (
            <CalligraphyControls
              svgSize={svgSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
        </>
      )}
    </StyledControlsBar>
  )
}

export default Controlsbar
