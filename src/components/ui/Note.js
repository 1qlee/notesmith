import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledNote = styled.div`
  padding: 16px 16px 16px 48px;
  position: relative;
  border-radius: 8px;
  border: 1px solid ${colors.gray.threeHundred};
  background-color: ${colors.white};
`

const NoteHoles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-right: 1px dashed ${colors.gray.threeHundred};
`

const NoteHole = styled.div`
  display: block;
  height: 12px;
  width: 12px;
  border: 1px solid ${colors.gray.threeHundred};
  background-color: ${colors.white};
  box-shadow: inset 1px 1px 2px ${colors.shadow.float};
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`

function Note({ children }) {
  return (
    <StyledNote>
      <NoteHoles>
        <NoteHole />
        <NoteHole />
        <NoteHole />
        <NoteHole />
        <NoteHole />
      </NoteHoles>
      {children}
    </StyledNote>
  )
}

export default Note