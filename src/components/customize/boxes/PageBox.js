import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { CaretDown, CaretUp } from "@phosphor-icons/react"

import Icon from "../../ui/Icon"
import Button from "../../ui/Button"

const StyledPageBox = styled.div`
  border-bottom: ${colors.borders.black};
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  input {
    font-size: 0.875rem;
    width: 100%;
  }
  input {
    border: none;
    padding: 14.5px 8px;
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
  top: 14.5px;
  left: ${props => props.left || null};
  right: ${props => props.right || null};
`

function PageBox({
  productData,
  handleScrollToItem,
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
    else if (pageNumber > productData.numOfPages) {
      return changePage(productData.numOfPages)
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

    const rowIndex = Math.ceil(pageNumber / 2)
    const columnIndex = pageNumber % 2 === 0 ? 2 : 1

    handleScrollToItem({
      align: "smart",
      rowIndex: rowIndex,
      columnIndex: columnIndex,
    })
    setSelectedPage(pageNumber)
  }

  useEffect(() => {
    pageSelectorInput.current.value = selectedPage
  }, [selectedPage])

  return (
    <StyledPageBox>
      <IconWrapper
        left="1rem"
      >
        <Button
          onClick={() => validatePageChange(selectedPage - 1)}
          padding="4px"
          backgroundcolor={colors.white}
          color={colors.gray.nineHundred}
          hoverbackgroundcolor={colors.gray.oneHundred}
        >
          <Icon>
            <CaretDown />
          </Icon>
        </Button>
      </IconWrapper>
      <input
        ref={pageSelectorInput}
        type="number"
        id="page-number-input"
        onKeyDown={e => validatePageChangeKeydown(e)}
        onBlur={e => validatePageChange(e.target.value)}
        onFocus={e => e.target.select()}
        defaultValue={selectedPage}
        min="1"
        max={productData.numOfPages}
        step="1"
      />
      <IconWrapper
        right="1rem"
      >
        <Button
          onClick={() => validatePageChange(selectedPage + 1)}
          padding="4px"
          backgroundcolor={colors.white}
          color={colors.gray.nineHundred}
          hoverbackgroundcolor={colors.gray.oneHundred}
        >
          <Icon>
            <CaretUp />
          </Icon>
        </Button>
      </IconWrapper>
    </StyledPageBox>
  )
}

export default PageBox
