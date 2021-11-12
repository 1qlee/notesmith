import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"
import { ArrowCircleRight } from "phosphor-react"

import Pagebar from "./Bars/Pagebar"
import Templatesbar from "./Bars/Templatesbar"
import Checkoutbar from "./Bars/Checkoutbar"
import Icon from "../Icon"
import Button from "../Button"

const StyledControls = styled.div`
  position: absolute;
  right: 0;
  height: calc(100% - 6rem);
  width: 300px;
`

const ControlsContent = styled.div`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layered};
  border: 1px solid ${colors.primary.sixHundred};
  border-radius: 0.25rem;
  height: 668px;
  overflow-x: hidden;
  overflow-y: scroll;
  &.is-absolute {
    position: absolute;
    top: 3.125rem;
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
  background-color: ${colors.white};
  display: inline-flex;
  list-style-type: none;
  margin-bottom: 1rem;
  box-shadow: ${colors.shadow.layered};
  border-radius: 0.25rem;
  border: 1px solid ${colors.primary.sixHundred};
  width: 100%;
`

const ControlTab = styled.li`
  background-color: ${colors.white};
  color: ${colors.primary.threeHundred};
  font-family: "Inter", Helvetica, sans-serif;
  font-size: 0.825rem;
  padding: 0.5rem 1rem;
  transition: color 0.2s, background-color 0.2s;
  height: 100%;
  flex: 1;
  font-weight: 700;
  text-align: center;
  &.is-active {
    background-color: ${colors.primary.sixHundred};
    color: ${colors.primary.white};
  }
  &:first-child {
    border-radius: 0.25rem 0 0 0.25rem;
  }
  &:last-child {
    border-radius: 0 0.25rem 0.25rem 0;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      color: ${colors.primary.fourHundred};
      background-color: ${colors.primary.hover};
    }
  }
`

function Controls({
  canvasPages,
  pageData,
  quantity,
  selectedPage,
  setPageData,
  setSelectedPage,
  setShowModal,
}) {
  const [activeTab, setActiveTab] = useState(1)
  const pagebarContent = useRef(null)

  return (
    <StyledControls>
      <ControlTabs>
        <ControlTab
          className={activeTab === 1 ? "is-active" : null}
          onClick={() => {
            setPageData({
              ...pageData,
              template: "",
            })
            setActiveTab(1)
          }}
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
      <ControlsContent
        ref={pagebarContent}
      >
        <Pagebar
          canvasPages={canvasPages}
          pageData={pageData}
          selectedPage={selectedPage}
          setPageData={setPageData}
          setSelectedPage={setSelectedPage}
        />
      </ControlsContent>
      {activeTab === 2 && (
        <ControlsContent className="is-absolute">
          <Templatesbar
            pageData={pageData}
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
