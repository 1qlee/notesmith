import React from "react"

import AlignmentControls from "../templateControls/components/AlignmentControls"
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
  max,
  pageData,
  selectedPageSvg,
  setPageData,
}) => {
  return (
    <>
      <AlignmentControls
        pageData={pageData}
        setPageData={setPageData}
        selectedPageSvg={selectedPageSvg}
      />
      {pageData.template === "ruled" && (
        <RuledControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "dot" && (
        <DotControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "graph" && (
        <GraphControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "hexagon" && (
        <HexagonControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "isometric" && (
        <IsometricControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "seyes" && (
        <SeyesControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "music" && (
        <MusicControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "handwriting" && (
        <HandwritingControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "cross" && (
        <CrossGridControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
      {pageData.template === "calligraphy" && (
        <CalligraphyControls
          max={max}
          pageData={pageData}
          setPageData={setPageData}
        />
      )}
    </>
  )
}

export default TemplateControls