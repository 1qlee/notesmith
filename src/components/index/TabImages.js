import React, { useState, useEffect } from "react"
import styled from "styled-components"

import { getImage, GatsbyImage } from "gatsby-plugin-image"

const StyledTabImages = styled.div`
  padding: 16px 0;
`

function TabImages({
  activeTab,
  tabImages,
}) {
  const [currentImage, setCurrentImage] = useState({})

  useEffect(() => {
    if (tabImages) {
      tabImages.sort((a, b) => parseInt(a.childImageSharp.fluid.originalName.slice(4)) - parseInt(b.childImageSharp.fluid.originalName.slice(4)))
      setCurrentImage(tabImages[activeTab])
    }
  }, [activeTab, tabImages])

  return (
    <StyledTabImages>
      <GatsbyImage
        image={getImage(currentImage)}
        alt="default"
      />
    </StyledTabImages>
  )
}

export default TabImages