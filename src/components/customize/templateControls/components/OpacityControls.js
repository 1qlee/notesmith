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
        min: 30,
        max: 100,
        step: 1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default OpacityControls