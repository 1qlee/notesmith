import React from "react"
import { convertToMM, convertFloatFixed } from "../../../styles/variables"

import { ControlsContent } from "../Controls"
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

function Designbar({
  pageData,
  max,
  setPageData,
  svgSize,
}) {
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.svgHeight) - pageData.thickness, 3)
  const maximumMarginWidth = convertFloatFixed(convertToMM(pageData.svgWidth), 3)
 
  return (
    <>
      <ControlsContent>
        {pageData.template !== "blank" && pageData.template !== "none" && (
          <>
            {pageData.template === "ruled" && (
              <RuledControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
            {pageData.template === "dot" && (
              <DotControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
            {pageData.template === "graph" && (
              <GraphControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
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
                max={max}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "isometric" && (
              <IsometricControls
                svgSize={svgSize}
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
              />
            )}
            {pageData.template === "seyes" && (
              <SeyesControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
            {pageData.template === "music" && (
              <MusicControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
            {pageData.template === "handwriting" && (
              <HandwritingControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
            {pageData.template === "cross" && (
              <CrossGridControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
            {pageData.template === "calligraphy" && (
              <CalligraphyControls
                maximumMarginHeight={maximumMarginHeight}
                maximumMarginWidth={maximumMarginWidth}
                max={max}
                pageData={pageData}
                setPageData={setPageData}
                svgSize={svgSize}
              />
            )}
          </>
        )}
      </ControlsContent>
    </>
  )
}

export default Designbar
