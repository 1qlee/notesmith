import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

const Book = styled.div`
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
  display: block;
  height: 100%;
  padding: 1rem;
  user-select: none;
  width: 100%;
  &.is-selected {
    box-shadow: 0 0 0 1px ${colors.blue.sixHundred}, inset 0 0 0 1px ${colors.white};
    border-color: ${colors.blue.sixHundred};
  }
  p {
    color: ${colors.gray.nineHundred};
  }
  small {
    margin: 0;
    color: ${colors.gray.fiveHundred};
    font-size: 0.85rem;
  }
`

const BookInput = styled.input`
  background: ${colors.paper.offWhite};
  border: none;
  box-shadow: inset 0 -1px 0 ${colors.gray.fourHundred};
  display: block;
  padding: 0;
  &:focus {
    outline: none;
  }
`

export {
  Book,
  BookInput
}
