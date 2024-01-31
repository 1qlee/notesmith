import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import { useSettingsContext } from "./context/settingsContext"

const StyledWorkspace = styled.div`
  background-color: ${colors.white};
  height: 100%;
  left: ${props => props.showPageBar ? "165px" : "0"};
  overflow: auto;
  position: absolute;
  right: ${props => props.showControls ? "300px" : "0"};
  top: 0;
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

const Workspace = ({ children }) => {
  const settingsState = useSettingsContext()

  return (
    <StyledWorkspace
      showPageBar={settingsState.view_pages}
      showControls={settingsState.view_controls}
    >
      {children}
    </StyledWorkspace>
  )
}

export default Workspace
