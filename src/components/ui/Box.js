import styled from "styled-components"
import { colors } from "../../styles/variables"

const Box = styled.div`
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
`

export default Box