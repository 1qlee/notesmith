import React from "react"
import { colors, fonts } from "../../styles/variables"
import styled from "styled-components"

const StyledTabs = styled.ul`
  border-bottom: 2px solid ${colors.gray.nineHundred};
  list-style-type: none;
  display: flex;
  justify-content: flex-start;
  border-radius: 4px 4px 0 0;
`

const StyledTab = styled.li`
  font-family: ${fonts.secondary};
  font-size: ${props => props.fontsize};
  font-weight: 700;
  flex: 1;
  padding: 16px;
  transition: padding 0.2s, background-color 0.2s;
  border-radius: 4px 4px 0 0;
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

export default Tabs