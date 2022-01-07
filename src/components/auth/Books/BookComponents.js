import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import Content from "../../Content"
import Tag from "../../ui/Tag"

const BookRadio = styled.div`
  display: block;
  background-color: ${colors.white};
  border-radius: 0.25rem;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s;
  border: 1px solid ${colors.gray.threeHundred};
  padding: 1rem;
  &.is-active {
    border-color: ${colors.blue.sixHundred};
    box-shadow: 0 0 1px 1px ${colors.blue.twoHundred};
    transform: translate(1px, 1px);
  }
  &:hover,
  &:focus {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.primary.hover};
    }
  }
`

const Book = styled.div`
  background-color: ${colors.white};
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px ${colors.shadow.float};
  display: block;
  height: 100%;
  padding: 1rem;
  user-select: none;
  max-width: 250px;
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

export {
  Book,
  BookRadio,
}
