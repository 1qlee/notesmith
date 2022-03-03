import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"
import { ArrowCircleRight } from "phosphor-react"

import Templatesbar from "./bars/templatesbar"
import Checkoutbar from "./bars/Checkoutbar"
import Icon from "../Icon"
import Button from "../Button"

const StyledControls = styled.div`
  width: 300px;
  height: 100%;
  border-left: 1px solid ${colors.gray.threeHundred};
  z-index: 8;
`

const ControlsContent = styled.div`
  background-color: ${colors.white};
  height: calc(100% - 56px);
  overflow-x: hidden;
  overflow-y: auto;
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
  border-bottom: 1px solid ${colors.gray.threeHundred};
  display: inline-flex;
  justify-content: flex-start;
  list-style-type: none;
  width: 100%;
`

const ControlTab = styled.li`
  background-color: ${colors.white};
  color: ${colors.primary.threeHundred};
  font-family: "Inter", Helvetica, sans-serif;
  font-size: 0.825rem;
  padding: 1rem;
  transition: color 0.2s, background-color 0.2s;
  height: 100%;
  font-weight: 700;
  text-align: center;
  &.is-active {
    color: ${colors.primary.eightHundred};
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
  bookData,
  canvasPages,
  pageData,
  productData,
  productImageData,
  selectedPageSvg,
  selectedPage,
  setBookData,
  setPageData,
  setShowModal,
  user,
}) {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <StyledControls>
      <ControlTabs>
        <ControlTab
          className={activeTab === 1 ? "is-active" : null}
          onClick={() => setActiveTab(1)}
        >
          Templates
        </ControlTab>
        {user && (
          <ControlTab
            className={activeTab === 2 ? "is-active is-checkout" : "is-checkout"}
            onClick={() => setActiveTab(2)}
          >
            Checkout
          </ControlTab>
        )}
      </ControlTabs>
      {activeTab === 1 && (
        <ControlsContent>
          <Templatesbar
            pageData={pageData}
            setShowModal={setShowModal}
            setPageData={setPageData}
            selectedPageSvg={selectedPageSvg}
          />
        </ControlsContent>
      )}
      {activeTab === 2 && (
        <ControlsContent>
          <Checkoutbar
            bookData={bookData}
            productData={productData}
            productImageData={productImageData}
            setBookData={setBookData}
          />
        </ControlsContent>
      )}
    </StyledControls>
  )
}

export default Controls
