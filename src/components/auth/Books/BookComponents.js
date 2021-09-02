import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import Content from "../../Content"

function BookRadio({
  title,
  description,
  price,
  img,
  size,
  isActive,
  setBookSize
}) {
  return (
    <BookRadioWrapper
      className={isActive ? "is-active" : null}
      onClick={() => setBookSize(size)}
    >
      <Flexbox
        flex="flex"
        alignitems="center"
        padding="1rem"
        backgroundcolor={colors.white}
        boxshadow={`0 1px 2px ${colors.shadow.float}`}
        borderradius="0.25rem"
      >
        <img width="60" src={img} />
        <Flexbox
          flex="flex"
          justifycontent="space-between"
          width="100%"
        >
          <Content
            h3margin="0"
            h3fontsize="1rem"
          >
            <h3>{title}</h3>
            <p>{description}</p>
          </Content>
          <Content>
            <h4>{price}</h4>
          </Content>
        </Flexbox>
      </Flexbox>
    </BookRadioWrapper>
  )
}

const BookRadioWrapper = styled.a`
  display: block;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: border-color 0.2s;
  &.is-active {
    border-color: ${colors.blue.sixHundred};
  }
  &:hover,
  &:focus {
    &:not(.is-active) {
      border-color: ${colors.gray.sixHundred};
    }
  }
`

const Book = styled.div`
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.threeHundred};
  display: block;
  height: 100%;
  padding: 1rem;
  user-select: none;
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

const BookInput = styled.input`
  background: ${colors.paper.offWhite};
  border: none;
  box-shadow: inset 0 -1px 0 ${colors.gray.fourHundred};
  display: block;
  padding: 0;
  &:focus {
    outline: none;
  }
`

export {
  Book,
  BookInput,
  BookRadio,
}
