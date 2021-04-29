import styled from "styled-components"
import { colors } from "../../styles/variables"

const Tag = styled.span`
  font-size: ${props => props.fontsize ? props.fontsize : "0.7rem"};
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.primary.sixHundred};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.color ? props.color : colors.white};
  display: inline-block;
  line-height: 1;
  padding: ${props => props.padding ? props.padding : "0.5rem 1rem"};
  &:not(:last-child) {
    margin: ${props => props.margin ? props.margin : "0 0 0.5rem 0"};
  }
`

export default Tag
