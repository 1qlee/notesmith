import React from "react"
import styled from "styled-components"
import { fonts, colors } from "../../styles/variables"

const StyledSpineText = styled.div`
  font-size: ${props => props.fontsize};
  font-weight: ${props => props.fontweight};
  font-family: ${fonts.secondary};
  display: inline-block;
  border-left: 2px solid ${colors.gray.nineHundred};
  padding-left: 0.5rem;
  margin-top: 1rem;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  min-height: 620px;
`

function SpineText(props) {
  return (
    <StyledSpineText {...props}>
      {props.children}
    </StyledSpineText>
  )
}

export default SpineText