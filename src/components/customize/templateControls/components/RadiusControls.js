import React from "react"

import RangeControls from "./RangeControls"

function RadiusControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="radius"
      propertyName="Dot radius"
      propertyObj={{ alignmentVertical: "", alignmentHorizontal: "" }}
      inputProps={{
        min: 0.1,
        max: 5,
        step: 0.1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default RadiusControls