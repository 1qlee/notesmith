import React from "react"
import { colors, fonts } from "../../styles/variables"
import styled from "styled-components"

const StyledTabs = styled.ul`
  border-bottom: 1px solid ${colors.gray.nineHundred};
  list-style-type: none;
  display: flex;
  justify-content: flex-start;
  font-size: ${props => props.fontsize};
`

const StyledTab = styled.li`
  color: ${colors.gray.sixHundred};
  font-family: ${fonts.secondary};
  font-weight: 700;
  transition: padding 0.2s, box-shadow 0.2s;
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
      box-shadow: inset 0 -1px 0 ${colors.gray.nineHundred};
    }
  }
  &.is-active {
    box-shadow: inset 0 -1px 0 ${colors.gray.nineHundred};
    color: ${colors.gray.nineHundred};
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
          key={index}
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