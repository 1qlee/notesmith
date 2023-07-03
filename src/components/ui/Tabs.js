import React from "react"
import { colors, fonts } from "../../styles/variables"
import styled from "styled-components"

const StyledTabs = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: flex-start;
  font-size: ${props => props.fontsize || "1rem"};
`

const StyledTab = styled.li`
  border: ${colors.borders.black};
  color: ${colors.gray.sixHundred};
  font-weight: 400;
  flex: 1;
  text-align: center;
  transition: background-color 0.2s, padding 0.2s, box-shadow 0.2s;
  padding: 8px;
  margin-right: -1px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.gray.threeHundred};
    }
  }
  &.is-active {
    background-color: ${colors.gray.nineHundred};
    color: ${colors.gray.oneHundred};
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