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
  svgData,
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
          svgData={svgData}
        />
      )}
      {pageData.template === "dot" && (
        <DotControls
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
          svgData={svgData}
        />
      )}
      {pageData.template === "graph" && (
        <GraphControls
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
          svgData={svgData}
        />
      )}
      {pageData.template === "hexagon" && (
        <HexagonControls
          svgData={svgData}
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "isometric" && (
        <IsometricControls
          svgData={svgData}
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
          svgData={svgData}
        />
      )}
      {pageData.template === "music" && (
        <MusicControls
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
          svgData={svgData}
        />
      )}
      {pageData.template === "handwriting" && (
        <HandwritingControls
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
          svgData={svgData}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGridControls
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
          svgData={svgData}
        />
      )}
      {pageData.template === "calligraphy" && (
        <CalligraphyControls
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
          max={max}
          pageData={pageData}
          setPageData={setPageData}
          svgData={svgData}
        />
      )}
    </>
  )
}

export default TemplateControls