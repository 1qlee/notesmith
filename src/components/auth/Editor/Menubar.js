import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

const StyledMenubar = styled.div`
  display: flex;
  align-items: center;
  padding-left: 3rem;
`

const MenuItem = styled.div`
  color: ${colors.white};
  padding: 0.5rem;
`

function Menubar() {
  return (
    <StyledMenubar>
      <MenuItem>File</MenuItem>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Object</MenuItem>
      <MenuItem>View</MenuItem>
    </StyledMenubar>
  )
}

export default Menubar
