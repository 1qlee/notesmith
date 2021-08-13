import styled from "styled-components"

const TextLink = styled.a`
  display: ${props => props.flex || "flex"};
  align-items: ${props => props.alignitems};
  color: ${props => props.color};
  transition: color 0.2s;
  margin: ${props => props.margin};
  width: ${props => props.width};
  &:hover {
    color: ${props => props.hovercolor};
  }
  &.has-icon {
    span + span {
      margin-left: 0.25rem;
    }
  }
`

export default TextLink
