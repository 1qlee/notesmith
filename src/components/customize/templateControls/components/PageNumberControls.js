import React from "react"

import ToggleControls from "./ToggleControls"

const PageNumberControls = () => {
  return (
    <ToggleControls 
      data={[
        { name: "enable" },
        { name: "disable" },
      ]}
      
    />
  )
}

export default PageNumberControls