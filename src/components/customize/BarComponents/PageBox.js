import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { CaretDown, CaretUp } from "phosphor-react"

import Content from "../../Content"
import Icon from "../../Icon"

const StyledPageBox = styled.div`
  border-bottom: 1px solid ${colors.gray.threeHundred};
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  label, input {
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    font-size: 0.75rem;
    width: 100%;
  }
  label {
    font-weight: 700;
    position: absolute;
    left: 1rem;
    top: 0.125rem;
  }
  input {
    border: none;
    padding: 1.5rem 1rem .5rem;
    text-align: center;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

const IconWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  left: ${props => props.left || null};
  right: ${props => props.right || null};
`

function PageBox({
  bookData,
  setSelectedPage,
  selectedPage,
  windowRef,
}) {

  function handlePageChange(value) {
    const pageNumber = parseInt(value)
    console.log(windowRef.current)
    windowRef.current.scrollToItem(120)

    if (pageNumber <= 0 || !pageNumber) {
      return
    }
    else if (pageNumber > bookData.numOfPages) {
      return
    }
    else {
      return setSelectedPage(pageNumber)
    }

  }

  return (
    <StyledPageBox>
      <Content>
        <label htmlFor="page-number-input">Go to page</label>
        <IconWrapper
          left="1rem"
        >
          <Icon>
            <CaretDown />
          </Icon>
        </IconWrapper>
        <input
          type="number"
          id="page-number-input"
          onChange={e => handlePageChange(e.target.value)}
          value={selectedPage}
        />
        <IconWrapper
          right="1rem"
        >
          <Icon>
            <CaretUp />
          </Icon>
        </IconWrapper>
      </Content>
    </StyledPageBox>
  )
}

export default PageBox
