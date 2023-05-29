import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledCaption = styled.article`
  padding: 16px;
  position: absolute;
  background-image: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 100%);
  bottom: 16px;
  left: 0;
  width: 100%;
  p {
    line-height: 1.75;
    font-weight: 800;
    font-size: 0.875rem;
    color: ${colors.gray.oneHundred};
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
        <p>Gold colored Wire-O binding.</p>
      )}
    </StyledCaption>
  )
}

export default TabImagesCaption