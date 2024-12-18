import React from "react"

import AngleControls from "./components/AngleControls"
import SpacingControls from "./components/SpacingControls"
import OpacityControls from "./components/OpacityControls"
import StrokeWidthControls from "./components/StrokeWidthControls"
import BorderControls from "./components/BorderControls"

function IsometricControls({
  pageData,
  setPageData,
  svgData,
}) {
  return (
    <>
      <BorderControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <AngleControls 
        pageData={pageData}
        setPageData={setPageData}
      />
      <SpacingControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <OpacityControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <StrokeWidthControls
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  )
}

export default IsometricControls
