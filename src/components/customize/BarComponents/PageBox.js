import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { CaretDown, CaretUp } from "phosphor-react"

import Icon from "../../ui/Icon"

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
    padding: 0.5rem 1rem 0.5rem;
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
  top: 0.5rem;
  left: ${props => props.left || null};
  right: ${props => props.right || null};
  &:hover {
    cursor: pointer;
  }
`

function PageBox({
  bookData,
  setSelectedPage,
  selectedPage,
}) {
  const pageSelectorInput = useRef(null)

  function validatePageChange(value) {
    // if the input is somehow not a number
    const pageNumber = isNaN(value) ? 1 : parseInt(value)

    // validation logic
    if (pageNumber <= 0) {
      return changePage(1)
    }
    else if (pageNumber > bookData.numOfPages) {
      return changePage(160)
    }
    else {
      return changePage(pageNumber)
    }
  }

  function validatePageChangeKeydown(e) {
    if (e.keyCode === 13 || e.keyCode === 27) {
      e.target.blur()
    }
  }

  function changePage(pageNumber) {
    pageSelectorInput.current.value = pageNumber
    setSelectedPage(pageNumber)
  }

  useEffect(() => {
    pageSelectorInput.current.value = selectedPage
  }, [selectedPage])

  return (
    <StyledPageBox>
      <IconWrapper
        onClick={() => validatePageChange(selectedPage - 1)}
        left="1rem"
      >
        <Icon>
          <CaretDown />
        </Icon>
      </IconWrapper>
      <input
        ref={pageSelectorInput}
        type="number"
        id="page-number-input"
        onKeyDown={e => validatePageChangeKeydown(e)}
        onBlur={e => validatePageChange(e.target.value)}
        defaultValue={selectedPage}
        min="1"
        max={bookData.numOfPages}
        step="1"
      />
      <IconWrapper
        right="1rem"
        onClick={() => validatePageChange(selectedPage + 1)}
      >
        <Icon>
          <CaretUp />
        </Icon>
      </IconWrapper>
    </StyledPageBox>
  )
}

export default PageBox
