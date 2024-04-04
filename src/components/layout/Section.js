import React from "react"
import styled from "styled-components"
import { colors, fonts, spacing } from "../../styles/variables"

const SectionMain = styled.main`
  background-color: ${colors.white};
  position: relative;
  padding: 0;
  margin-top: 60px;
  &.has-vertical-padding {
    padding: ${spacing.large} 0;
  }
  &.has-no-padding {
    padding: 0;
  }
  &.has-max-height {
    min-height: calc(100vh - 109.5px);
  }
`

const Section = styled.section`
  background-color: ${props => props.backgroundcolor};
  position: relative;
  display: ${props => props.flex && "flex"};
  align-items: ${props => props.flex && "center"};
  justify-content: ${props => props.flex && "center"};
  height: ${props => props.height};
  min-height: ${props => props.minheight};
  overflow: hidden;
  width: 100%;
`

const SectionContent = styled.div`
  background-color: ${props => props.backgroundcolor};
  padding: ${props => props.padding ? props.padding : `${spacing.section} 0`};
  position: relative;
  height: ${props => props.height};
  &.has-border-top {
    border-top: 1px solid ${colors.gray.nineHundred};
  }
`

const SectionHeading = styled.h3`
  margin: ${props => props.margin || "0 0 32px 0"};
  display: inline-block;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.75rem;
  padding-bottom: 4px;
  color: ${props => props.color || colors.gray.sevenHundred};
  font-family: ${fonts.secondary};
`

export {
  SectionMain,
  Section,
  SectionContent,
  SectionHeading,
}
