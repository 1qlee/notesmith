import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"
import { ArrowCircleRight } from "phosphor-react"

import Pagebar from "./Bars/Pagebar"
import Templatesbar from "./Bars/Templatesbar"
import Checkoutbar from "./Bars/Checkoutbar"
import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const StyledControls = styled.div`
  position: absolute;
  right: 0;
  height: calc(100% - 6rem);
  width: 300px;
`

const ControlsContent = styled.div`
  background-color: ${colors.white};
  box-shadow: 0 1px 2px ${colors.shadow.float};
  border-top: 1px solid ${colors.gray.threeHundred};
  border-radius: 0 0 0.25rem 0.25rem;
  height: calc(100% - 3rem);
  overflow-x: hidden;
  overflow-y: auto;
  &.is-absolute {
    position: absolute;
    top: 3rem;
    left: 0;
    width: 300px;
    z-index: 100;
    box-shadow: none;
  }
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

const ControlTabs = styled.ul`
  display: inline-flex;
  list-style-type: none;
  box-shadow: 0 1px 2px ${colors.shadow.float};
  padding: 0;
  margin: 0;
  border-radius: 0.25rem 0.25rem 0 0;
  width: 100%;
`

const ControlTab = styled.li`
  background-color: ${colors.white};
  color: ${colors.gray.sixHundred};
  flex: 1;
  font-family: "Inter", Helvetica, sans-serif;
  font-size: 0.825rem;
  margin: 0;
  padding: 1rem 0.5rem;
  text-align: center;
  transition: border-color 0.2s;
  &.is-active {
    color: ${colors.gray.nineHundred};
    background-color: ${colors.primary.oneHundred};
  }
  &.is-checkout {
    color: ${colors.blue.sixHundred};
  }
  &:first-child {
    border-radius: 0.25rem 0 0;
  }
  &:last-child {
    border-radius: 0 0.25rem 0 0;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      border-color: ${colors.primary.hover};
    }
  }
`

function Controls({
  canvasPages,
  pageData,
  pageSize,
  quantity,
  selectedPage,
  setPageData,
  setPageSize,
  setSelectedPage,
  setShowModal,
  setInitializing,
  initializing
}) {
  const [activeTab, setActiveTab] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState()

  return (
    <StyledControls>
      <ControlTabs>
        <ControlTab
          className={activeTab === 1 ? "is-active" : null}
          onClick={() => setActiveTab(1)}
        >
          Pages
        </ControlTab>
        <ControlTab
          className={activeTab === 2 ? "is-active" : null}
          onClick={() => setActiveTab(2)}
        >
          Templates
        </ControlTab>
        <ControlTab
          className={activeTab === 3 ? "is-active is-checkout" : "is-checkout"}
          onClick={() => setActiveTab(3)}
        >
          Checkout
        </ControlTab>
      </ControlTabs>
      <ControlsContent>
        <Pagebar
          canvasPages={canvasPages}
          pageData={pageData}
          pageSize={pageSize}
          selectedPage={selectedPage}
          setPageData={setPageData}
          setPageSize={setPageSize}
          setSelectedPage={setSelectedPage}
          setInitializing={setInitializing}
          initializing={initializing}
        />
      </ControlsContent>
      {activeTab === 2 && (
        <ControlsContent className="is-absolute">
          <Templatesbar
            pageData={pageData}
            pageSize={pageSize}
            setShowModal={setShowModal}
            setPageData={setPageData}
          >
            Templates
          </Templatesbar>
        </ControlsContent>
      )}
      {activeTab === 3 && (
        <ControlsContent className="is-absolute">
          <Checkoutbar
            initialQuantity={quantity}
          />
        </ControlsContent>
      )}
    </StyledControls>
  )
}

export default Controls
