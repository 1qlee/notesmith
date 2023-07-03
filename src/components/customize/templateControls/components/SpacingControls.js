import React from "react"

import RangeControls from "./RangeControls"

function SpacingControls({
  name,
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="spacing"
      propertyName={name || "Spacing"}
      propertyObj={{}}
      inputProps={{
        min: 1,
        max: 255,
        step: 1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default SpacingControls