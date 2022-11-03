import React, { useState } from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"

import Controlsbar from "./bars/Controlsbar"
import Checkoutbar from "./bars/Checkoutbar"
import Templatesbar from "./bars/Templatesbar"

const StyledControls = styled.div`
  border-left: 1px solid ${colors.gray.threeHundred};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  width: ${widths.sidebar};
  z-index: 8;
`

const ControlsContent = styled.div`
  background-color: ${colors.white};
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  width: 100%;
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

const ControlsTabs = styled.ul`
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray.threeHundred};
  display: inline-flex;
  justify-content: flex-start;
  list-style-type: none;
  width: 100%;
`

const ControlsTab = styled.li`
  background-color: ${colors.white};
  color: ${colors.gray.sixHundred};
  font-family: "Inter", Helvetica, sans-serif;
  font-size: 0.825rem;
  padding: 1rem 0;
  margin: 0 1rem;
  transition: color 0.2s, background-color 0.2s;
  height: 100%;
  font-weight: 700;
  text-align: center;
  &.is-active {
    box-shadow: 0 2px 0 ${colors.gray.nineHundred};
    color: ${colors.gray.nineHundred};
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      box-shadow: 0 2px 0 ${colors.gray.sixHundred};
    }
  }
`

const ControlsFooter = styled.div`
  padding: 1rem;
`

function Controls({
  activeTab,
  bookData,
  pageData,
  productData,
  productImageData,
  setBookData,
  setPageData,
  setShowModal,
  setActiveTab,
  svgSize,
  toast,
  user,
}) {

  function handleApplyTemplateButton() {
    // don't show the modal if no template is selected
    if (!pageData.template) {
      toast.error("Click and select a template first!")
    }
    else {
      setShowModal({
        show: true,
        type: "template"
      })
    }
  }

  return (
    <StyledControls>
      <ControlsTabs>
        <ControlsTab
          className={activeTab === 0 && "is-active"}
          onClick={() => setActiveTab(0)}
        >
          Templates
        </ControlsTab>
        {pageData.template && (
          <ControlsTab
            className={activeTab === 1 && "is-active"}
            onClick={() => setActiveTab(1)}
          >
            Design
          </ControlsTab>
        )}
        {user && (
          <ControlsTab
            className={activeTab === 2 && "is-active"}
            onClick={() => setActiveTab(2)}
          >
            Checkout
          </ControlsTab>
        )}
      </ControlsTabs>
      {activeTab === 0 && (
        <Templatesbar
          pageData={pageData}
          setPageData={setPageData}
          handleApplyTemplateButton={handleApplyTemplateButton}
        />
      )}
      {activeTab === 1 && (
        <Controlsbar
          pageData={pageData}
          setPageData={setPageData}
          setShowModal={setShowModal}
          svgSize={svgSize}
          handleApplyTemplateButton={handleApplyTemplateButton}
        />
      )}
      {activeTab === 2 && (
        <Checkoutbar
          bookData={bookData}
          pageData={pageData}
          productData={productData}
          productImageData={productImageData}
          setBookData={setBookData}
          toast={toast}
        />
      )}
    </StyledControls>
  )
}

export { Controls, ControlsContent, ControlsTabs, ControlsTab, ControlsFooter }
