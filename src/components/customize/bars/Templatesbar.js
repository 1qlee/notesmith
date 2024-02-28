import React from "react"
import { colors } from "../../../styles/variables"
import { useEditorDispatch } from "../context/editorContext"

import PageIcons from "../PageIcons"
import { ControlsContent, ControlsFooter } from "../Controls"
import Button from "../../ui/Button"

function Templatesbar({
  pageData,
  setPageData,
  handleShowModal,
}) {
  const dispatch = useEditorDispatch()

  function handleTemplateChange(data) {
    dispatch({
      type: "ungroup-selection",
      id: "selection-group",
    })
    return setPageData(data)
  }

  return (
    <>
      <ControlsContent>
        <PageIcons
          checkActiveVar={pageData.template}
          isProductPage={false}
          setData={handleTemplateChange}
          data={pageData}
          showLabels={true}
        />
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

export default Templatesbar