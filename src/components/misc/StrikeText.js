import styled from "styled-components"
import { colors } from "../../styles/variables"

const StrikeText = styled.span`
  position: relative;
  color: ${colors.gray.sixHundred};
  margin-right: 8px;
  &::before {
    top: 50%;
    background: ${colors.gray.sixHundred};
    content: '';
    width: 100%;
    position: absolute;
    height: 2px;
    left: 0
    white-space:nowrap;
    display: block;
  }
`

export default StrikeText