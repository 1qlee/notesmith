import styled from "styled-components"
import { colors } from "../../styles/variables"

const Box = styled.div`
  border-radius: ${props => props.borderradius};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  width: ${props => props.width};
  max-width: ${props => props.maxwidth};
  height: ${props => props.height};
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