import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { CaretRight, Check } from "@phosphor-icons/react"

import Icon from "../../ui/Icon"
import { Flexbox } from "../../layout/Flexbox"
import { useSettingsContext, useSettingsDispatch } from "../context/settingsContext"
import { navigate } from "gatsby"

const Menu = styled.dialog`
  background-color: ${colors.white};
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  display: none;
  left: ${props => props.left || "0"};
  position: absolute;
  top: ${props => props.top || "100%"};
  width: 164px;
  &.is-main {
    display: ${props => props.showMenu ? "block" : "none"};
    border-right: ${colors.borders.black};
    border-bottom: ${colors.borders.black};
    margin-top: 1px;
    z-index: 9;
  }
  &.is-sub {
    display: ${props => props.isHovered ? "block" : "none"};
    border: ${colors.borders.black};
    border-top: 1px dashed ${colors.gray.threeHundred};
    top: -5px;
    left: 100%;
    z-index: 10;
  }
`

const MenuGroup = styled.div`
  padding: 4px 0;
  &:not(:last-child) {
    border-bottom: 1px dashed ${colors.gray.threeHundred};
  }
`

const MenuItem = styled(Flexbox)`
  font-size: 0.875rem;
  list-style: none;
  padding: 4px 12px 4px 28px;
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.nineHundred};
    color: ${colors.gray.oneHundred};
  }
`

const MenuIcon = styled(Icon)`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
`

const DropdownMenu = ({ groups, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const settingsState = useSettingsContext()
  const dispatchSettings = useSettingsDispatch()

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMenuItemClick = item => {
    if (item.link) {
      return navigate(item.link)
    }
    else {
      dispatchSettings({ 
        type: "toggle", 
        updates: {
          [item.value]: !settingsState[item.value],
        }
      })
    }
  }

  return (
    <Menu
      {...props}
      isHovered={props.isHovered}
      className={props.className}
      showMenu={showMenu}
    >
      {groups.map((group, index) => (
        <MenuGroup key={index}>
          {group.map(item => (
            <MenuItem
              key={item.value}
              onMouseEnter={handleMouseEnter}
              onClick={() => handleMenuItemClick(item)}
              justify={item.toggleable ? "flex-start" : "space-between"}
              align="center"
            >
              {item.toggleable && settingsState[item.value] && (
                <MenuIcon
                  margin="0 12px 0 0"
                >
                  <Check weight="bold" size={12} />
                </MenuIcon>
              )}
              <span>{item.label}</span>
              {item.children && (
                <>
                  <Icon>
                    <CaretRight weight="fill" size={12} />
                  </Icon>
                  <DropdownMenu
                    groups={item.children}
                    left="100%"
                    top="0"
                    className="is-sub"
                    isHovered={isHovered}
                  />
                </>
              )}
            </MenuItem>
          ))}
        </MenuGroup>
      ))}
    </Menu>
  )
}

export default DropdownMenu