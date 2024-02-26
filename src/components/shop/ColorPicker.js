import React from "react"
import { colors } from "../../styles/variables"
import { Tooltip } from "react-tooltip"
import styled from "styled-components"

const ColorOption = styled.button`
  background-color: ${props => props.color};
  border-radius: 4px;
  border: 1px solid ${colors.gray.nineHundred};
  height: 40px;
  position: relative;
  width: 30px;
  &:focus,
  &.is-active {
    box-shadow: ${colors.shadow.focus};
    border-color: transparent;
    outline: none;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      &:not(:focus) {
        box-shadow: ${colors.shadow.focus};
      }
    }
  }
  &:not(:last-child) {
    margin-right: 1rem;
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
