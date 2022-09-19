import React from "react"
import { colors, fonts } from "../../styles/variables"
import styled from "styled-components"

const StyledTabs = styled.ul`
  border-bottom: 2px solid ${colors.gray.nineHundred};
  list-style-type: none;
  display: flex;
  justify-content: flex-start;
`

const StyledTab = styled.li`
  font-family: ${fonts.secondary};
  font-size: ${props => props.fontsize};
  font-weight: 700;
  transition: padding 0.2s, border-color 0.2s;
  border-bottom: 2px solid transparent;
  padding: 8px 0;
  margin: 0 16px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      border-bottom-color: ${colors.gray.threeHundred};
    }
  }
  &.is-active {
    border-bottom-color: ${colors.gray.nineHundred};
  }
`

function Tabs({
  fontsize,
  tabList,
  activeTab,
  setActiveTab,
}) {
  return (
    <StyledTabs>
      {tabList.map((tab, index) => (
        <StyledTab
          onClick={() => setActiveTab(index)}
          className={activeTab === index && "is-active"}
          fontsize={fontsize}
        >
          {tab}
        </StyledTab>
      ))}
    </StyledTabs>
  )
}

export { StyledTabs, StyledTab, Tabs }