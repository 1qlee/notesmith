import styled from "styled-components"
import { colors } from "../../../styles/variables"

const BookRadio = styled.div`
  display: block;
  background-color: ${colors.white};
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s;
  border-left: 1px solid ${colors.gray.threeHundred};
  border-right: 1px solid ${colors.gray.threeHundred};
  border-bottom: 1px solid ${colors.gray.threeHundred};
  padding: 1rem;
  &:first-child {
    border-radius: 0.25rem 0.25rem 0 0;
    border-top: 1px solid ${colors.gray.threeHundred};
  }
  &:last-child {
    border-radius: 0 0 0.25rem 0.25rem;
  }
  &.has-border-top {
    border-top: 1px solid ${colors.gray.threeHundred};
  }
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
