import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledHighlight = styled.span`
  background: linear-gradient(0deg, ${colors.yellow.threeHundred} 0%, transparent 40%);
`

function Highlight({ children }) {
  return (
    <StyledHighlight>
      {children}
    </StyledHighlight>
  )
}

export default Highlight