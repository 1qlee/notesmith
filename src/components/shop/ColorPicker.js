import React, { useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"

const ColorOption = styled.button`
  background-color: ${props => props.color};
  border-radius: 100%;
  border: 1px solid ${colors.gray.threeHundred};
  height: 1.5rem;
  position: relative;
  width: 1.5rem;
  &::before {
    background: transparent;
    border-radius: 100%;
    border: 2px solid transparent;
    content: "";
    height: calc(100% + 0.5rem);
    left: -0.25rem;
    position: absolute;
    top: -0.25rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: calc(100% + 0.5rem);
  }
  &.is-active {
    &::before {
      border-color: ${colors.blue.sixHundred}
    }
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:focus {
    &::before {
      border-color: ${colors.blue.sixHundred};
    }
  }
  &:hover,
  &:focus {
    cursor: pointer;
    outline: none;
    &:not(.is-active) {
      &::before {
        border-color: ${colors.gray.threeHundred};
      }
    }
  }
`

function ColorPicker({
  bookData,
  setBookData
}) {
  return (
    <Content
      fontfamily="Inter, Helvetica, Tahoma, sans-serif"
      h3fontsize="0.75rem"
      margin="2rem 0"
    >
      <h3>Cover color</h3>
      <Flexbox
        flex="flex"
        alignitems="center"
      >
        {bookData.colors.map(color => (
          <ColorOption
            key={color.name}
            color={color.hex}
            name={color.name}
            className={color.name === bookData.coverColor && "is-active"}
            onClick={() => setBookData({
              ...bookData,
              coverColor: color.name,
            })}
          />
        ))}
      </Flexbox>
    </Content>
  )
}

export default ColorPicker
