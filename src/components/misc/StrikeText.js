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
    transform: rotate(-15deg);
    left: 0;
    white-space: nowrap;
    display: block;
  }
  @media only screen and (min-width: ${props => props.hiddenminwidth}px) and (max-width: ${props => props.hiddenmaxwidth}px) {
    display: none;
  }
`

export default StrikeText