import styled from "styled-components"
import { colors } from "../../styles/variables"

const Tag = styled.span`
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.primary.sixHundred};
  border-radius: 2rem;
  border: ${props => props.border};
  box-shadow: ${props => props.boxshadow ? props.boxshadow : `0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float}`};
  color: ${props => props.color ? props.color : colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.fontfamily};
  font-size: ${props => props.fontsize ? props.fontsize : "0.7rem"};
  font-weight: ${props => props.fontweight};
  height: fit-content;
  margin: ${props => props.margin};
  padding: ${props => props.padding ? props.padding : "0.5rem 1rem"};
  text-align: center;
  width: ${props => props.width};
  &:not(:last-child) {
    margin: ${props => props.margin ? props.margin : "0 0 0.5rem 0"};
  }
`

export default Tag
