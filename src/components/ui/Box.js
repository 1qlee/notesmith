import styled from "styled-components"
import { colors } from "../../styles/variables"

const Box = styled.div`
  background-color: ${props => props.backgroundcolor};
  border-radius: ${props => props.borderradius};
  border-bottom: ${props => props.borderbottom};
  border: ${props => props.border};
  margin: ${props => props.margin};
  padding: ${props => props.padding};
  position: ${props => props.position};
  flex: ${props => props.flex};
  margin: ${props => props.margin};
  width: ${props => props.width};
  max-width: ${props => props.maxwidth};
  max-height: ${props => props.maxheight};
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
  &.has-styled-scrollbar {
    &::-webkit-scrollbar {
      height: 0.5rem;
      width: 0.5rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${colors.gray.threeHundred};
    }
  }
`

export default Box