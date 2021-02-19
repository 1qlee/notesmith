import styled from "styled-components"
import { colors } from "../../styles/variables"

const PriceTag = styled.div`
  font-size: ${props => props.fontSize};
  text-align: center;
  border-radius: ${props => props.borderRadius};
  color: ${props => props.color};
  display: inline-block;
  padding: ${props => props.padding};
  position: relative;
  z-index: 1;
  &::after {
    background-color: ${props => props.backgroundColor || colors.primary.sixHundred};
    content: "";
    height: 100%;
    left: -1rem;
    position: absolute;
    border-radius: 50% 1rem 100% 1rem;
    bottom: -0.25rem;
    opacity: 0.5;
    width: 200%;
    z-index: -1;
  }
`

const ProductDetails = styled.div`
  width: 500px;
  &.fade-enter{
     opacity: 0;
  }
  &.fade-exit{
     opacity: 1;
  }
  &.fade-enter-active{
     opacity: 1;
  }
  &.fade-exit-active{
     opacity: 0;
     transform: translateX(100px);
  }
  &.fade-enter-active,
  &.fade-exit-active{
     transition: opacity 0.2s, transform 0.2s;
  }
`

export {
  PriceTag,
  ProductDetails
}
