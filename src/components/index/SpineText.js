import React from "react"
import styled from "styled-components"

const StyledSpineText = styled.div`
  font-size: ${props => props.fontsize};
  font-weight: ${props => props.fontweight};
  display: inline-block;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
`

function SpineText(props) {
  return (
    <StyledSpineText {...props}>
      {props.children}
    </StyledSpineText>
  )
}

export default SpineText