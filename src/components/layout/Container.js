import styled from "styled-components"
import { widths, spacing } from "../../styles/variables"

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 100%;
  &.is-aligned-left {
    justify-content: flex-start;
  }
  &.is-aligned-right {
    justify-content: flex-end;
  }
`

const LayoutContainer = styled.div`
  max-width: ${widths.desktop};
  margin: 0 ${spacing.normal};
  height: 100%;
  width: 100%;
`

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction ? props.direction : "row"};
  align-items: ${props => props.alignitems ? props.alignitems : "flex-start"};
  justify-content: ${props => props.justifycontent ? props.justifycontent : "flex-start"};
  height: ${props => props.height ? props.height : "auto"};
  position: relative;
`

export { Container, LayoutContainer, FlexContainer }
