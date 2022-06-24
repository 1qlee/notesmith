import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { colors, fonts } from "../../styles/variables"
import { Check, CaretDown } from "phosphor-react"

import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const StyledSelect = styled.div`
  position: relative;
  display: inline-block;
  p {
    font-size: 0.75rem;
    font-family: ${fonts.secondary};
    margin-right: 0.25rem;
    color: ${colors.gray.sixHundred};
  }
`

const SelectMenu = styled.div`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layeredSmall};
  border-radius: 0.25rem;
  padding: 0.5rem 0;
  position: absolute;
  font-size: 0.8rem;
  top: calc(100% + 0.5rem);
  left: 0;
  width: calc(200% - 1.35rem);
  z-index: 1000;
  &::before {
    content: "";
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    background-color: ${colors.white};
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    top: -0.25rem;
  }
`

const SelectMenuDivider = styled.hr`
  background-color: ${colors.gray.threeHundred};
  margin: 0.5rem 0;
`

const SelectOption = styled.div`
  align-items: center;
  display: flex;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  padding: 0.25rem 2rem;
  position: relative;
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.twoHundred};
  }
`

const SelectIcon = styled.div`
  position: absolute;
  right: calc(100% - 1.5rem);
  top: 0.4rem;
`

const SelectHeading = styled.h4`
  color: ${colors.gray.fourHundred};
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  padding: 0.25rem 2rem;
  font-weight: 400;
  &:hover {
    color: ${colors.gray.sixHundred};
  }
`

function Select({ initialSortOrder, initialOption, initialDbValue, mainFunction }) {
  const [showMenu, setShowMenu] = useState(false)
  const [currentOption, setCurrentOption] = useState(initialOption)
  const [currentDbValue, setCurrentDbValue] = useState(initialDbValue)
  const [currentSortOrder, setCurrentSortOrder] = useState(initialSortOrder)
  const menuRef = useRef()

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu)
      document.removeEventListener("keydown", handleEscKey)
    }
  })

  function handleEscKey(e) {
    if (e.keyCode === 27) {
      setShowMenu(false)
    }
  }

  function handleClickOutsideMenu(e) {
    if (menuRef.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setShowMenu(false)
  }

  function handleMenuClick(option, order) {
    if (order) {
      mainFunction(currentDbValue, order, currentOption)
      setCurrentSortOrder(order)
      setShowMenu(false)
    }
    else {
      mainFunction(option.dbValue, currentSortOrder, option.domValue)
      setCurrentOption(option.domValue)
      setCurrentDbValue(option.dbValue)
      setShowMenu(false)
    }
  }

  return (
    <StyledSelect
      ref={menuRef}
    >
      <Flexbox
        flex="flex"
        alignitems="center"
        margin="0 0 1rem 0"
      >
        <p>Sort:</p>
        <Button
          borderradius="0"
          backgroundcolor={colors.white}
          onClick={() => setShowMenu(!showMenu)}
          fontsize="0.75rem"
          padding="0.25rem"
          border={`1px solid ${colors.gray.nineHundred}`}
        >
          <span>{currentOption}</span>
          <Icon margin="0 0 0 0.125rem">
            <CaretDown color={colors.gray.nineHundred} size="0.625rem"  />
          </Icon>
        </Button>
      </Flexbox>
      {showMenu && (
        <SelectMenu onClick={e => handleClickOutsideMenu(e)}>
          <SelectHeading>Sort by</SelectHeading>
          <SelectOption
            onClick={e => {handleMenuClick({
              dbValue: "title",
              domValue: "Alphabetical"
            })}}
          >
            {currentDbValue === "title" && (
              <SelectIcon>
                <Icon>
                  <Check weight="fill" color={colors.gray.nineHundred} size="0.8rem" />
                </Icon>
              </SelectIcon>
            )}
            Alphabetical
          </SelectOption>
          <SelectOption
            onClick={e => {handleMenuClick({
              dbValue: "dateCreated",
              domValue: "Date created"
            })}}
          >
            {currentDbValue === "dateCreated" && (
              <SelectIcon>
                <Icon>
                  <Check weight="fill" color={colors.gray.nineHundred} size="0.8rem" />
                </Icon>
              </SelectIcon>
            )}
            Date created
          </SelectOption>
          <SelectMenuDivider />
          <SelectHeading>Order</SelectHeading>
          <SelectOption
            onClick={e => {handleMenuClick(null, "ascending")}}
          >
            {currentSortOrder === "ascending" && (
              <SelectIcon>
                <Icon>
                  <Check weight="fill" color={colors.gray.nineHundred} size="0.8rem" />
                </Icon>
              </SelectIcon>
            )}
            Ascending
          </SelectOption>
          <SelectOption
            onClick={e => {handleMenuClick(null, "descending")}}
          >
            {currentSortOrder === "descending" && (
              <SelectIcon>
                <Icon>
                  <Check weight="fill" color={colors.gray.nineHundred} size="0.8rem" />
                </Icon>
              </SelectIcon>
            )}
            Descending
          </SelectOption>
        </SelectMenu>
      )}
    </StyledSelect>
  )
}

Select.propTypes = {
  initialSortOrder: PropTypes.string.isRequired,
  initialOption: PropTypes.string.isRequired,
  initialDbValue: PropTypes.string.isRequired,
  mainFunction: PropTypes.func.isRequired
}

SelectOption.propTypes = {
  'data-primaryoption': PropTypes.string,
  'data-secondaryoption': PropTypes.string,
  'data-optionname': PropTypes.string
}

export {
  Select,
  StyledSelect,
  SelectOption,
  SelectMenu,
  SelectHeading
}
