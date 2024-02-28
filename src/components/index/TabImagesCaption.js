import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledCaption = styled.article`
  padding: 8px;
  position: absolute;
  background-image: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%);
  bottom: 16px;
  left: 0;
  width: 100%;
  p {
    line-height: 1.75;
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
        <p>70 sheets (140 total pages) of smooth, white 70# text paper.</p>
      )}
      {activeTab === 1 && (
        <p>Double mounted 125# cover stock.</p>
      )}
      {activeTab === 2 && (
        <p>Lamination film on front side of each cover.</p>
      )}
      {activeTab === 3 && (
        <p>Gold colored wire binding.</p>
      )}
    </StyledCaption>
  )
}

export default TabImagesCaption