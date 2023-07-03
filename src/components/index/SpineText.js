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
  @media only screen and (max-width: 600px) {
    border-bottom: 2px solid ${colors.gray.nineHundred};
    border-left: none;
    margin-top: 0;
    min-height: auto;
    padding-bottom: 0.5rem;
    padding-left: 0;
    transform: rotate(0deg);
    width: 100%;
    writing-mode: inherit;
  }
`

function SpineText(props) {
  return (
    <StyledSpineText {...props}>
      {props.children}
    </StyledSpineText>
  )
}

export default SpineText