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
      border-color: ${colors.primary.sixHundred}
    }
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:focus {
    &::before {
      border-color: ${colors.primary.sixHundred};
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

// expecting data to be an array of color objects
function ColorPicker({
  data,
  selectedColor,
  cbFunction
}) {
  return (
    <Flexbox
      flex="flex"
      alignitems="center"
      padding="0 0 0 0.25rem"
      flexwrap="wrap"
    >
      {data.map(color => (
        <ColorOption
          key={color.name}
          color={color.hex}
          name={color.name}
          className={color.name === selectedColor && "is-active"}
          onClick={() => cbFunction(color.name)}
        />
      ))}
    </Flexbox>
  )
}

export default ColorPicker
