import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"

const Tag = styled.span`
  align-items: center;
  background-color: ${props => props.backgroundcolor ? props.backgroundcolor : colors.gray.nineHundred};
  border-radius: ${props => props.borderradius || "0px"};
  border: ${props => props.border};
  color: ${props => props.color ? props.color : colors.white};
  display: inline-flex;
  font-family: ${props => props.fontfamily || fonts.secondary};
  font-size: ${props => props.fontsize ? props.fontsize : "0.75rem"};
  font-weight: ${props => props.fontweight || "700"};
  height: fit-content;
  justify-content: center;
  letter-spacing: ${props => props.letterspacing};
  margin: ${props => props.margin};
  padding: ${props => props.padding ? props.padding : "3px 6px"};
  text-align: center;
  text-transform: ${props => props.texttransform};
  white-space: nowrap;
  width: ${props => props.width};
  &:not(:last-child) {
    margin: ${props => props.margin ? props.margin : "0 0 0.5rem 0"};
  }
`

export default Tag
