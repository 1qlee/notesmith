import styled from "styled-components"
import { colors } from "../styles/variables"

const Tag = styled.span`
  font-size: ${props => props.fontSize ? props.fontSize : "0.7rem"};
  border-radius: 1rem;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : colors.primary.sixHundred};
  color: ${props => props.color ? props.color : colors.white};
  display: inline-block;
  letter-spacing: 1px;
  font-family: sans-serif;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export default Tag
