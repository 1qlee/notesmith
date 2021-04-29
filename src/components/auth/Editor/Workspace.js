import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

const StyledWorkspace = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

function Workspace({ children }) {
  return (
    <StyledWorkspace>
      {children}
    </StyledWorkspace>
  )
}

export default Workspace
