import React from "react"
import { colors } from "../../../styles/variables"
import { convertToMM, convertFloatFixed } from "../../../utils/helper-functions"

import { ControlsContent, ControlsFooter } from "../Controls"
import MarginControls from "../templateControls/components/MarginControls"
import TemplateControls from "../controls/TemplateControls"
import DesignControls from "../controls/DesignControls"
import Button from "../../ui/Button"

function Designbar({
  handleShowModal,
  pageData,
  max,
  selectedPageSvg,
  setPageData,
}) {
  const maximumMarginHeight = convertFloatFixed(convertToMM(pageData.svgHeight) - pageData.strokeWidth, 3)
  const maximumMarginWidth = convertToMM(pageData.svgWidth)
 
  return (
    <>
      <ControlsContent>
        <MarginControls
          pageData={pageData}
          setPageData={setPageData}
          maximumMarginHeight={maximumMarginHeight}
          maximumMarginWidth={maximumMarginWidth}
        />
        {pageData.template && pageData.template !== "blank" && pageData.template !== "none" ? (
          <TemplateControls 
            max={max}
            pageData={pageData}
            selectedPageSvg={selectedPageSvg}
            setPageData={setPageData}
          />
        ) : (
          <DesignControls />
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
