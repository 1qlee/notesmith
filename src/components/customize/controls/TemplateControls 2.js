import React from "react"

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

const TemplateControls = ({
  maximumMarginHeight,
  maximumMarginWidth,
  max,
  pageData,
  setPageData,
  svgSize,
}) => {
  return (
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
  )
}

export default TemplateControls