import React from "react"

import RangeControls from "./RangeControls"

function StaffSpacingControls({
  name,
  pageData,
  setPageData,
}) {
  return (
    <RangeControls
      property="staffSpacing"
      propertyName={name || "Staff spacing"}
      propertyObj={{ alignmentVertical: "" }}
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

export default StaffSpacingControls