import React, { useState } from "react"
import { colors } from "../../../styles/variables"
import PageIcons from "../PageIcons"

import { ControlsContent, ControlsFooter } from "../Controls"
import Button from "../../ui/Button"

function Templatesbar({
  pageData,
  setPageData,
  setShowModal,
}) {
  let buttonText

  if (pageData.template) {
    buttonText = "Apply template"
  }
  else {
    buttonText = "Apply changes"
  }

  return (
    <>
      <ControlsContent>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(60px, 1fr))",
            gap:"16px",
          }}
        >
          <PageIcons
            checkActiveVar={pageData.template}
            isProductPage={false}
            setData={setPageData}
            data={pageData}
            showLabels={true}
          />
        </div>
      </ControlsContent>
      <ControlsFooter>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          color={colors.gray.oneHundred}
          padding="16px"
          width="100%"
          onClick={() => setShowModal({
            show: true,
            type: "template"
          })}
        >
          {buttonText}
        </Button>
      </ControlsFooter>
    </>
  )
}

export default Templatesbar