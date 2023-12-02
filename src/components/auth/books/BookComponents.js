import styled from "styled-components"
import { colors } from "../../../styles/variables"

const BookRadio = styled.button`
  display: block;
  background-color: ${colors.white};
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s;
  border-radius: 8px;
  border: 1px solid ${colors.gray.nineHundred};
  padding: 1rem;
  width: 50%;
  text-align: left;
  &:hover,
  &:focus {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.gray.oneHundred};
    }
  }
`

const Book = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray.threeHundred};
  border-radius: 0.25rem;
  display: block;
  height: 100%;
  padding: 1rem;
  user-select: none;
  transition: border-color 0.2s;
  max-width: 250px;
  width: 100%;
  &.is-selected {
    border-color: ${colors.gray.sixHundred};
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

export {
  Book,
  BookRadio,
}
