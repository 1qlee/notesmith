import styled from "styled-components"
import { colors } from "../../styles/variables"

const Box = styled.div`
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  width: ${props => props.width};
  height: ${props => props.height};
  &.has-border {
    border: ${colors.borders.black};
  }
`

export default Box