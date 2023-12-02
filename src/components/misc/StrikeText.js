import styled from "styled-components"
import { colors } from "../../styles/variables"

const StrikeText = styled.span`
  position: relative;
  color: ${props => props.color || colors.gray.sixHundred};
  margin-right: 8px;
  display: inline-block;
  &::before {
    top: calc(50% - 2px);
    background: ${props => props.color || colors.gray.sixHundred};
    content: '';
    width: 100%;
    position: absolute;
    height: 2px;
    left: 0
    white-space: nowrap;
    display: block;
  }
`

export default StrikeText