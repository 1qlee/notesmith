import React from "react"
import { convertToMM, convertFloatFixed } from "../../../styles/variables"

import { ControlsContent } from "../Controls"
import TemplateControls from "../controls/TemplateControls"
import DesignControls from "../controls/DesignControls"

function Designbar({
  pageData,
  max,
  setPageData,
  svgSize,
}) {
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.svgHeight) - pageData.strokeWidth, 3)
  const maximumMarginWidth = convertFloatFixed(convertToMM(pageData.svgWidth), 3)
 
  return (
    <>
      <ControlsContent>
        {pageData.template && pageData.template !== "blank" && pageData.template !== "none" ? (
          <TemplateControls 
            maximumMarginHeight={maximumMarginHeight}
            maximumMarginWidth={maximumMarginWidth}
            max={max}
            pageData={pageData}
            setPageData={setPageData}
            svgSize={svgSize}
          />
        ) : (
          <DesignControls />
        )}
      </ControlsContent>
    </>
  )
}

export default Designbar
