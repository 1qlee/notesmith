import styled from "styled-components"
import React from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import Button from "./Button"
import Icon from "./Icon"
import { colors } from "../../styles/variables"

const ArrowButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: ${props => props.side === "left" && "8px"};
  right: ${props => props.side === "right" && "8px"};
  transform: translateY(-50%);
  padding: 4px;
  background-color: ${colors.gray.threeHundred};
  border: ${colors.borders.black};
  border-radius: 50%;
  color: ${colors.gray.nineHundred};
`

const Dot = styled.button`
  background-color: rgba(0,0,0,0.3);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  margin-bottom: 16px;
  &:hover {
    background-color: rgba(0,0,0,0.6);
  }
`

const Arrow = ({ onClick, side }) => {
  if (side === "left") {
    return (
      <ArrowButton side={side} onClick={() => onClick()}>
        <Icon>
          <CaretLeft />
        </Icon>
      </ArrowButton>
    )
  }
  return (
    <ArrowButton side={side} onClick={() => onClick()}>
      <Icon>
        <CaretRight />
      </Icon>
    </ArrowButton>
  )
}

export { Arrow, Dot }