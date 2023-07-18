import React from "react"
import { convertToMM, convertFloatFixed, colors } from "../../../styles/variables"

import { ControlsContent, ControlsFooter } from "../Controls"
import Button from "../../ui/Button"
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
  setPageData,
  svgSize,
  setShowModal,
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
      </ControlsContent>
      <ControlsFooter>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="1rem"
          width="100%"
          disabled={!pageData.template}
          onClick={() => setShowModal({
            show: true,
            type: "template"
          })}
        >
          Apply template
        </Button>
      </ControlsFooter>
    </>
  )
}

export default Designbar
