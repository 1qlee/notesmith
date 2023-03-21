import React from "react"
import styled from "styled-components"
import { fonts } from "../../styles/variables"

const StyledCaption = styled.article`
  padding: 16px;
  position: absolute;
  background-image  : linear-gradient(180deg, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.75) 50%, #fff 100%);
  bottom: 16px;
  left: 0;
  width: 100%;
  p {
    line-height: 1.5;
    font-weight: 700;
    font-size: 0.75rem;
    font-family: ${fonts.secondary};
  }
`

function TabImagesCaption({
  activeTab
}) {
  return (
    <StyledCaption>
      {activeTab === 0 && (
        <p>70 sheets (140 total pages) of ultra-smooth, bright white 70lb text paper.</p>
      )}
      {activeTab === 1 && (
        <p>Double mounted 130lb cover stock.</p>
      )}
      {activeTab === 2 && (
        <p>Sand-matte textured lamination film on the outer side of each cover.</p>
      )}
      {activeTab === 3 && (
        <p>Gold colored Wire-O binding</p>
      )}
    </StyledCaption>
  )
}

export default TabImagesCaption