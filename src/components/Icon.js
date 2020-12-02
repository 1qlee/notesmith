import React from "react"
import styled from "styled-components"

import { BookOpen, Book, FileText, SquareHalf, Scissors, Notebook, NoteBlank, ShieldCheck } from "phosphor-react"

const StyledIcon = styled.span`
  align-items: center;
  border-radius: 100%;
  display: inline-flex;
  justify-content: center;
  position: relative;
`

function Icon({ icon, size, weight, color, children }) {
  switch(icon) {
    case "Book":
      return (
        <StyledIcon>
          <Book weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "BookOpen":
      return (
        <StyledIcon>
          <BookOpen weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "FileText":
      return (
        <StyledIcon>
          <FileText weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "Notebook":
      return (
        <StyledIcon>
          <Notebook weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "NoteBlank":
      return (
        <StyledIcon>
          <NoteBlank weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "Scissors":
      return (
        <StyledIcon>
          <Scissors weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "SquareHalf":
      return (
        <StyledIcon>
          <SquareHalf weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    case "ShieldCheck":
      return (
        <StyledIcon>
          <ShieldCheck weight={weight} size={size} color={color} />
        </StyledIcon>
      )
    default:
      return (
        <StyledIcon>
          {children}
        </StyledIcon>
      )
  }
}

export default Icon
