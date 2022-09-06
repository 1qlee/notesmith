import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import Content from "../Content"

const StyledContent = styled(Content)`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 24px;
    left: 0;
    width: 32px;
    height: 2px;
    background-color: ${colors.gray.nineHundred};
  }
`

function BoxText(props) {
  return (
    <StyledContent
      h3fontsize="1rem"
      h3margin="0 0 16px"
    >
      {props.children}
    </StyledContent>
  )
}

export default BoxText