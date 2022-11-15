import React from "react"
import styled from "styled-components"
import { fonts } from "../../styles/variables"
import RandomLine from "../misc/Lines"

const StyledSectionHeading = styled.div`
  margin-bottom: 32px;
  display: inline-block;
  position: relative;
  h2 {
    font-size: 1rem;
    font-family: ${fonts.secondary};
  }
`

function SectionHeading({
  children
}) {
  return (
    <StyledSectionHeading>
      <h2>{children}</h2>
      <RandomLine />
    </StyledSectionHeading>
  )
}

export default SectionHeading