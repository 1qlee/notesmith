import React from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"

import Controlsbar from "./bars/Controlsbar"
import Templatesbar from "./bars/Templatesbar"
import Checkoutbar from "./Bars/Checkoutbar"

const StyledControls = styled.div`
  border-left: ${colors.borders.black};
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
  padding: 32px 16px;
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
  border-bottom: ${colors.borders.black};
  display: inline-flex;
  justify-content: flex-start;
  list-style-type: none;
  width: 100%;
`

const ControlsTab = styled.li`
  background-color: ${colors.white};
  color: ${colors.gray.sixHundred};
  padding: 1rem 0;
  transition: color 0.2s, background-color 0.2s;
  height: 100%;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
  &.is-active {
    background-color: ${colors.gray.nineHundred};
    color: ${colors.gray.oneHundred};
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.gray.twoHundred};
    }
  }
`

const ControlsFooter = styled.div`
  padding: 1rem;
`

function Controls({
  activeTab,
  bookData,
  canvasPages,
  pageData,
  productData,
  productImages,
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
          canvasPages={canvasPages}
          productData={productData}
          productImages={productImages}
          setBookData={setBookData}
          toast={toast}
        />
      )}
    </StyledControls>
  )
}

export { Controls, ControlsContent, ControlsTabs, ControlsTab, ControlsFooter }
