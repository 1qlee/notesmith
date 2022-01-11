import styled from "styled-components"

const Flexbox = styled.div`
  align-items: ${props => props.alignitems};
  background-color: ${props => props.backgroundcolor};
  border: ${props => props.border};
  border-width: ${props => props.borderwidth};
  border-radius: ${props => props.borderradius};
  box-shadow: ${props => props.boxshadow};
  display: ${props => props.flex};
  justify-content: ${props => props.justifycontent};
  flex-direction: ${props => props.flexdirection};
  flex-wrap: ${props => props.flexwrap};
  flex: ${props => props.flexprop};
  height: ${props => props.height};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  width: ${props => props.width};
  max-width: ${props => props.maxwidth};
  &.has-border-bottom {
    border-bottom: 1px solid ${props => props.bordercolor};
  }
  &.has-border-top {
    border-top: 1px solid ${props => props.bordercolor};
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
