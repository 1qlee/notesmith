import React from "react"
import { colors } from "../../styles/variables"
import styled from "styled-components"

const PickerWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 48px);
  gap: 16px;
  margin: 16px 8px 32px;
  justify-content: ${props => props.center ? `center` : `flex-start`};
`

const ColorOption = styled.button`
  border: none;
  background-color: transparent;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    padding: 0.25rem;
    border-radius: 4px;
    transition: 0.2s background-color;
    line-height: 1;
    font-size: 0.875rem;
    margin-top: 8px;
  }
  .color-picker {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  &.is-active {
    p {
      background-color: ${colors.gray.nineHundred};
      color: ${colors.gray.oneHundred};
    }
    .color-picker {
      border-color: ${colors.white};
      box-shadow: 0 0 0 3px ${colors.gray.nineHundred};
      transform: translateY(-2px);
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      p {
        color: ${colors.gray.nineHundred};
      }
      div {
        border-color: ${colors.gray.nineHundred};
      }
      .color-picker {
        border-color: ${colors.gray.nineHundred};
        box-shadow: 0 0 0 2px ${colors.gray.nineHundred};
        transform: translateY(-2px);
      }
    }
  }
  &:focus {
    .color-picker {
      border-color: ${colors.gray.nineHundred};
      box-shadow: 0 0 0 2px ${colors.gray.nineHundred};
      transform: translateY(-2px);
    }
  }
`

const ColorIcon = styled.div`
  background-color: ${props => props.color};
  border-radius: 4px;
  border: 1px solid;
  border-color: ${colors.gray.nineHundred};
  height: 40px;
  position: relative;
  margin: auto;
  transition: box-shadow 0.2s, transform 0.2s;
  width: 30px;
`

// expecting data to be an array of color objects
function ColorPicker({
  data,
  selectedColor,
  cbFunction,
  center,
}) {
  return (
    <PickerWrapper
      center={center}
    >
      {data.map(color => (
        <React.Fragment key={color.name}>
          <ColorOption
            onClick={() => cbFunction(color.slug)}
            className={color.slug === selectedColor && `is-active`}
          >
            <ColorIcon
              data-tip={color.name}
              aria-label={`${color.name} cover`}
              key={color.name}
              color={color.hex}
              className={color.slug === selectedColor ? `color-picker is-active` : `color-picker`}
            />
            <p>{color.name}</p>
          </ColorOption>
        </React.Fragment>
      ))}
    </PickerWrapper>
  )
}

export default ColorPicker
