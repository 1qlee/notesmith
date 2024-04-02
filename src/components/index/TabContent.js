import React from "react"

import Box from "../ui/Box"
import TabImages from "./TabImages"

function TabContent({
  tabImages,
  activeTab
}) {

  return (
    <Box position="relative">
      <TabImages
        activeTab={activeTab}
        tabImages={tabImages}
      />
    </Box>
  )
}

export default TabContent