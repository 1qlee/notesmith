import styled from "styled-components"
import { colors, spacing } from "../../styles/variables"

const SectionMain = styled.main`
  background-color: ${colors.paper.cream};
  position: relative;
  padding: 96px 0 0 96px;
  height: 100%;
  &.has-vertical-padding {
    padding: ${spacing.large} 0;
  }
  &.has-no-padding {
    padding: 0;
  }
`

const Section = styled.section`
  width: 100%;
`

const SectionContent = styled.div`
  background-color: ${props => props.backgroundColor ? props.backgroundColor : colors.white};
  height: 100%;
  padding: 0 1rem;
  position: relative;
  width: ${props => props.width ? props.width : "50%"};
  &.is-image {
    background-image: url(${props => props.image});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center right;
  }
`

const SectionLayout = styled.div`
  padding: ${spacing.section} 0;
`

export { SectionMain, Section, SectionLayout, SectionContent }
