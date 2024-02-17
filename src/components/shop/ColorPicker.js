import React from "react"
import { colors } from "../../styles/variables"
import { Tooltip } from "react-tooltip"
import styled from "styled-components"

const ColorOption = styled.button`
  background-color: ${props => props.color};
  border-radius: 100%;
  border: 1px solid ${colors.gray.sixHundred};
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
    transition: border-color 0.2s;
    width: calc(100% + 0.5rem);
  }
  &.is-active {
    &::before {
      border-color: ${colors.gray.nineHundred}
    }
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
  &:focus {
    &::before {
      border-color: ${colors.gray.sixHundred};
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
    <>
      {data.map(color => (
        <>
          <ColorOption
            data-tip={color.name}
            aria-label={`${color.name} cover`}
            key={color.name}
            color={color.hex}
            className={color.slug === selectedColor ? `picker-${color.slug} is-active` : `picker-${color.slug}`}
            onClick={() => cbFunction(color.slug)}
          />
          <Tooltip
            anchorSelect={`.picker-${color.slug}`}
            content={color.name}
            place="top"
          />
        </>
      ))}
    </>
  )
}

export default ColorPicker
