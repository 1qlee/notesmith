import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledBoxList = styled.div`
  padding: ${props => props.padding};
  width: ${props => props.width};
  margin: ${props => props.margin};
  box-shadow: 6px 6px 0 ${colors.gray.threeHundred};
  border: 2px solid ${colors.gray.nineHundred};
`

const BoxListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifycontent};
  margin: ${props => props.margin || "0 0 -2px"};
  padding: ${props => props.padding || "0 1rem"};
  height: ${props => props.height};
  &:not(:last-child) {
    border-bottom: 2px solid ${colors.gray.nineHundred};
  }
`

function BoxList({
  width,
  margin,
  padding,
  children,
}) {
  return (
    <StyledBoxList
      width={width}
      margin={margin}
      padding={padding}
    >
      {children}
    </StyledBoxList>
  )
}

export { BoxList, BoxListItem }