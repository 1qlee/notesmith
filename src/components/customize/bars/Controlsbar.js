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
  canvasPageSize,
  pageData,
  setPageData,
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
            />
          )}
          {pageData.template === "dot" && (
            <DotControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "graph" && (
            <GraphControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "hexagon" && (
            <HexagonControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "isometric" && (
            <IsometricControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "seyes" && (
            <SeyesControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "music" && (
            <MusicControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "handwriting" && (
            <HandwritingControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "cross" && (
            <CrossGridControls
              canvasPageSize={canvasPageSize}
              maximumMarginHeight={maximumMarginHeight}
              maximumMarginWidth={maximumMarginWidth}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "calligraphy" && (
            <CalligraphyControls
              canvasPageSize={canvasPageSize}
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
