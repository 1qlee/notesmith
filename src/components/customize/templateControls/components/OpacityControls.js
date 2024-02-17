import React from "react"

import RangeControls from "./RangeControls"

function OpacityControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="opacity"
      propertyName="Opacity"
      propertyObj={{}}
      inputProps={{
        min: 0.3,
        max: 1,
        step: 0.1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default OpacityControls