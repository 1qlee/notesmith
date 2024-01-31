import styled from "styled-components"
import { colors } from "../../styles/variables"

const Box = styled.div`
  border-radius: ${props => props.borderradius};
  border-bottom: ${props => props.borderbottom};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: ${props => props.position};
  margin: ${props => props.margin};
  width: ${props => props.width};
  max-width: ${props => props.maxwidth};
  height: ${props => props.height};
  overflow: ${props => props.overflow};
  &.has-border {
    border: ${colors.borders.black};
  }
  &.no-border-top {
    border-top-width: 0 !important;
  }
  &.is-clickable {
    &:hover {
      background-color: ${colors.gray.twoHundred};
    }
  }
`

export default Box