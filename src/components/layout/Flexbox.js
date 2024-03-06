import styled from "styled-components"
import { colors } from "../../styles/variables"

const Flexbox = styled.div`
  align-items: ${props => props.align};
  background-color: ${props => props.backgroundcolor};
  border: ${props => props.border};
  border-width: ${props => props.borderwidth};
  border-radius: ${props => props.borderradius};
  box-shadow: ${props => props.boxshadow};
  display: ${props => props.flex || "flex"};
  justify-content: ${props => props.justify};
  flex-direction: ${props => props.flexdirection};
  flex-wrap: ${props => props.flexwrap};
  flex: ${props => props.flexprop};
  height: ${props => props.height};
  gap: ${props => props.gap};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  width: ${props => props.width};
  max-width: ${props => props.maxwidth};
  max-height: ${props => props.maxheight};
  &.has-border-bottom {
    border-bottom: ${colors.borders.black};
  }
  &.has-border-top {
    border-top: ${colors.borders.black};
  }
  &.has-border-left {
    border-left: ${colors.borders.black};
  }
  &.has-border-right {
    border-right: ${colors.borders.black};
  }
`

const FlexboxButtons = styled.div`
  button, a {
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`

export {
  Flexbox,
  FlexboxButtons
}
