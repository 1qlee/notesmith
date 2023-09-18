import React from "react"
import PageIcons from "../PageIcons"
import { useEditorDispatch } from "../context/editorContext"

import { ControlsContent } from "../Controls"

function Templatesbar({
  pageData,
  setPageData,
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
            setData={handleTemplateChange}
            data={pageData}
            showLabels={true}
          />
        </div>
      </ControlsContent>
    </>
  )
}

export default Templatesbar