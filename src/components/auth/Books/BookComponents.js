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
  width,
  height,
  isActive,
  setBookData
}) {
  return (
    <BookRadioWrapper
      className={isActive ? "is-active" : null}
      onClick={() => setBookData({ size: size, height: height, width: width })}
    >
      <Flexbox
        flex="flex"
        alignitems="center"
        padding="1rem"
        boxshadow={`0 1px 2px ${colors.shadow.float}`}
        borderradius="0.25rem"
      >
        <img width="60" src={img} alt="misc" />
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
  box-shadow: 0 1px 2px 0 ${colors.shadow.float};
  background-color: ${colors.white};
  border-radius: 0.25rem;
  transition: border-color 0.2s, background-color 0.2s;
  border: 1px solid transparent;
  &.is-active {
    border-color: ${colors.blue.sixHundred};
    box-shadow: 0 1px 2px 0 ${colors.blue.threeHundred};
  }
  &:hover,
  &:focus {
    &:not(.is-active) {
      background-color: ${colors.gray.twoHundred};
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
