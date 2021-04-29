import React from "react"
import styled from "styled-components"

const StyledIcon = styled.span`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  position: relative;
  margin: ${props => props.margin};
`

function Icon({ children, ...p }) {
  return (
    <StyledIcon {...p}>
      {children}
    </StyledIcon>
  )
}

export default Icon
