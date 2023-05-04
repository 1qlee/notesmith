import React from "react"
import styled from "styled-components"
import { colors, spacing, widths, fonts } from "../../styles/variables"
import RandomLine from "../misc/Lines"


const SectionMain = styled.main`
  background-color: ${colors.white};
  position: relative;
  padding: 0;
  &.has-vertical-padding {
    padding: ${spacing.large} 0;
  }
  &.has-no-padding {
    padding: 0;
  }
  &.has-max-height {
    min-height: calc(100vh - 105px);
  }
`

const Section = styled.section`
  background-color: ${props => props.backgroundcolor};
  background-image: url(${props => props.backgroundimage});
  position: relative;
  width: 100%;
`

const SectionContent = styled.div`
  background-color: ${props => props.backgroundcolor};
  padding: ${props => props.padding ? props.padding : `${spacing.section} 0`};
  position: relative;
  &.has-border-top {
    border-top: 2px solid ${colors.gray.nineHundred};
  }
`

const StyledSectionHeading = styled.div`
  margin: ${props => props.margin || "0 0 32px 16px"};
  display: inline-block;
  position: relative;
  h2 {
    font-size: ${props => props.fontsize || "1rem"};
    font-family: ${fonts.secondary};
  }
`

function SectionHeading({
  children,
  margin,
  fontsize,
}) {
  return (
    <StyledSectionHeading
      margin={margin}
      fontsize={fontsize}
    >
      <h2>{children}</h2>
      <RandomLine />
    </StyledSectionHeading>
  )
}

export {
  SectionMain,
  Section,
  SectionContent,
  SectionHeading,
}
