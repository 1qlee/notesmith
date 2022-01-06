import styled from "styled-components"
import { colors } from "../../styles/variables"

const Tag = styled.span`
  font-size: ${props => props.fontsize ? props.fontsize : "0.7rem"};
  font-family: ${props => props.fontfamily};
  font-weight: ${props => props.fontweight};
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.primary.sixHundred};
  box-shadow: ${props => props.boxshadow ? props.boxshadow : `0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float}`};
  border-radius: 2rem;
  border: ${props => props.border};
  color: ${props => props.color ? props.color : colors.white};
  display: inline-block;
  text-align: center;
  padding: ${props => props.padding ? props.padding : "0.5rem 1rem"};
  height: fit-content;
  width: ${props => props.width};
  &:not(:last-child) {
    margin: ${props => props.margin ? props.margin : "0 0 0.5rem 0"};
  }
`

export default Tag
