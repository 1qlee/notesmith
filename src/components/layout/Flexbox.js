import styled from "styled-components"

const Flexbox = styled.div`
  align-items: ${props => props.alignitems};
  background-color: ${props => props.backgroundcolor};
  border: ${props => props.border};
  borderWidth: ${props => props.borderWidth};
  display: ${props => props.flex};
  justify-content: ${props => props.justifyContent};
  flex-direction: ${props => props.flexDirection};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: relative;
  width: ${props => props.width};
  &.has-border-bottom {
    border-bottom: 1px solid ${props => props.borderColor};
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
