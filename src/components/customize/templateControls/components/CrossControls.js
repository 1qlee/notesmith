import React from "react"
import RangeControls from "./RangeControls"

function CrossControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="crossSize"
      propertyName="Cross size"
      propertyObj={{
        alignmentVertical: "",
        alignmentHorizontal: "",
      }}
      inputProps={{
        min: 1,
        max: 122,
        step: 1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default CrossControls