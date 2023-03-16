import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledHighlight = styled.span`
  background-image: linear-gradient(60deg, transparent 0%,${colors.highlighter} 12%, ${colors.highlighter} 100%);
`

function Highlight({ children }) {
  return (
    <StyledHighlight>
      {children}
    </StyledHighlight>
  )
}

export default Highlight