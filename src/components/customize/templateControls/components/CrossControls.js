import React from "react"
import RangeControls from "./RangeControls"

function CrossControls({
  step,
  max,
  min,
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
        min: min,
        max: max,
        step: step,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default CrossControls