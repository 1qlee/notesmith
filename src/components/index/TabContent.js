import React from "react"
import styled from "styled-components"

import TabImages from "./TabImages"
import TabImagesCaption from "./TabImagesCaption"

const StyledTabContent = styled.div`
  position: relative;
`

function TabContent({
  tabImages,
  activeTab
}) {

  return (
    <StyledTabContent>
      <TabImages
        activeTab={activeTab}
        tabImages={tabImages}
      />
      <TabImagesCaption
        activeTab={activeTab}
      />
    </StyledTabContent>
  )
}

export default TabContent