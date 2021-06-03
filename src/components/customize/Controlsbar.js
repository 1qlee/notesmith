import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import Pagebar from "./Pagebar"
import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const StyledControlsbar = styled.div`
  position: absolute;
  right: 0;
  height: calc(100% - 6rem);
  width: 300px;
  padding: 0 1rem;
`

const ControlTabs = styled.ul`
  display: flex;
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid ${colors.gray.threeHundred};
`

const ControlTab = styled.li`
  background-color: ${colors.white};
  padding: 0.5rem;
  margin: 0;
  border: 2px solid transparent;
  transition: border-color 0.2s, background-color 0.2s;
  &.is-active {
    border-color: ${colors.primary.sixHundred};
    background-color: ${colors.primary.active};
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.primary.hover};
    }
  }
  &:first-child {
    border-radius: 12px 0 0 0 / 6px 0 0 0;
  }
  &:last-child {
    border-radius: 0 12px 0 0 / 0 6px 0 0;
  }
`

function Controlsbar({
  quantity,
  selectedPage,
  setPageSize,
  setSelectedPage,
  pageSize
}) {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <StyledControlsbar>
      <ControlTabs>
        <ControlTab
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? "is-active" : null}
        >
          Pages
        </ControlTab>
        <ControlTab
          onClick={() => setActiveTab(2)}
          className={activeTab === 2 ? "is-active" : null}
        >
          Options
        </ControlTab>
      </ControlTabs>
      <Pagebar
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </StyledControlsbar>
  )
}

export default Controlsbar
