import React from "react"
import { colors } from "../../../styles/variables"
import { convertToMM, convertFloatFixed } from "../../../utils/helper-functions"

import { ControlsContent, ControlsFooter } from "../Controls"
import TemplateControls from "../controls/TemplateControls"
import DesignControls from "../controls/DesignControls"
import Button from "../../ui/Button"

function Designbar({
  handleShowModal,
  pageData,
  max,
  setPageData,
  svgData,
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
            svgData={svgData}
          />
        ) : (
          <DesignControls
            maximumMarginHeight={maximumMarginHeight}
            maximumMarginWidth={maximumMarginWidth}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
      </ControlsContent>
      <ControlsFooter>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="16px"
          width="100%"
          onClick={() => handleShowModal()}
        >
          Apply changes
        </Button>
      </ControlsFooter>
    </>
  )
}

export default Designbar
