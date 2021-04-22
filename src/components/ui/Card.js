import styled from "styled-components"
import { colors } from "../../styles/variables"

const Card = styled.div`
  background-color: ${props => props.background};
  clip-path: polygon(0 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%);
  display: flex;
  flex-direction: column;
  height: ${props => props.height};
  padding: 1rem;
  position: relative;
  width: ${props => props.width};
  &::before {
    background-color: ${props => props.background};
    box-shadow: -1px 1px 8px ${colors.shadow.float};
    content: '';
    display: block;
    height: 48px;
    position: absolute;
    right: -1px;
    top: -1px;
    width: 48px;
  }
`

const CardWrapper = styled.div`
  filter: drop-shadow(${props => props.dropshadow});
  &:not(:last-child) {
    margin-right: 1rem;
  }
`

export { Card, CardWrapper}
