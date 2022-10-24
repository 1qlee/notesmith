import React from "react"

import RangeControls from "./RangeControls"

function AngleControls({
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="angle"
      propertyName="Angle"
      propertyObj={{ }}
      inputProps={{
        min: 1,
        max: 89,
        step: 1,
      }}
      pageData={pageData}
      setPageData={setPageData}
    />
  )
}

export default AngleControls