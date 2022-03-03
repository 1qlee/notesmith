import styled from "styled-components"

const TextLink = styled.a`
  align-items: ${props => props.alignitems};
  border-bottom: ${props => props.borderbottom};
  color: ${props => props.color};
  display: ${props => props.flex || "flex"};
  justify-content: ${props => props.justifycontent};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  transition: color 0.2s;
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
