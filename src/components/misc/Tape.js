import styled from "styled-components"
import { colors } from "../../styles/variables"

const Tape = styled.div`
  background-color: #dbd8be;
  opacity: 0.5;
  box-shadow: 0 1px 4px ${colors.shadow.float};
  height: 24px;
  left: 50%;
  position: absolute;
  top: -0.8rem;
  transform: translateX(-50%) rotate(${props => props.num}deg);
  width: 6rem;
  z-index: 8;
  &::before,
  &::after {
    background-size: 4px 4px;
    bottom: 0;
    content: '';
    position: absolute;
    top: 0;
    width: 3px;
  }
  &::before {
    background-image: linear-gradient(135deg, transparent 40%, #dbd8be 40%);
    background-position: 100% 100%;
    left: -3px;
  }
  &::after {
    background-image: linear-gradient(-135deg, transparent 40%, #dbd8be 40%);
    background-position: 0 100%;
    right: -3px;
  }
`

export default Tape