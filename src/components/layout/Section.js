import styled from "styled-components"
import { colors, spacing, widths } from "../../styles/variables"

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
    min-height: 100vh;
  }
  @media only screen and (max-width: ${widths.tablet}) {
    padding: 6rem 0 0;
  }
`

const Section = styled.section`
  background-color: ${props => props.backgroundcolor};
  position: relative;
  width: 100%;
`

const SectionContent = styled.div`
  padding: ${props => props.padding ? props.padding : `${spacing.section} 0`};
  position: relative;
  @media only screen and (max-width: ${widths.tablet}) {
    padding: 4rem 0;
  }
`

const SectionApp = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const SectionAppContent = styled.section`
  height: 100%;
  width: 100%;
`

const SectionAppWorkspace = styled.div`
  height: ${props => props.heightmargin ? `calc(100vh - ${props.heightmargin})` : "100vh"};
  padding: ${props => props.padding || "2rem"};
  width: 100%;
`

export {
  SectionMain,
  Section,
  SectionContent,
  SectionApp,
  SectionAppContent,
  SectionAppWorkspace,
}
