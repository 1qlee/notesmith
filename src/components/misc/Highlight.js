import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledHighlight = styled.span`
  background-image: linear-gradient(60deg, #cdd98c 0%,${colors.highlighter} 0%, ${colors.highlighter} 100%, #cdd98c 100%);
`

function Highlight({ children }) {
  return (
    <StyledHighlight>
      {children}
    </StyledHighlight>
  )
}

export default Highlight