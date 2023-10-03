import React from "react"

import RangeControls from "./RangeControls"

function RadiusControls({
  min,
  max,
  step,
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="radius"
      propertyName="Dot radius"
      propertyObj={{ alignmentVertical: "", alignmentHorizontal: "" }}
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

export default RadiusControls