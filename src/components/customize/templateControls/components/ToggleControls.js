import React from "react"
import styled from "styled-components"
import { colors } from "../../../../styles/variables"

import Button from "../../../ui/Button"

const ToggleWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.nineHundred};
  border-radius: 0.25rem;
  background-color: ${colors.white};
  padding: 0.25rem;
  margin-bottom: 1rem;
`

const ToggleButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.gray.nineHundred};
  font-size: 0.875rem;
  padding: 6px;
  flex: 1;
  position: relative;
  text-transform: capitalize;
  &:not(:last-child) {
    margin-right: 2px;
  }
  &:hover,
  &:focus {
    box-shadow: none;
    background-color: ${colors.gray.twoHundred};
  }
  &.is-active {
    color: ${colors.gray.oneHundred};
    background-color: ${colors.gray.nineHundred};
  }
`

const Toggle = ({ 
  data,
  value,
  setData,
}) => {
  return (
    <ToggleWrapper>
      {data.map((item, index) => (
        <ToggleButton
          key={item.name}
          className={item.name === value ? "is-active" : null}
          onClick={() => setData(item.name)}
        >
          {item.name}
        </ToggleButton>
      ))}
    </ToggleWrapper>
  )
}

export default Toggle