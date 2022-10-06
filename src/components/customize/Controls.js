import React from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"

import Button from "../Button"
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
  overflow: hidden;
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
      <ControlTabs>
        <ControlTab
          className={activeTab === 0 && "is-active"}
          onClick={() => setActiveTab(0)}
        >
          Templates
        </ControlTab>
        {pageData.template && (
          <ControlTab
            className={activeTab === 1 && "is-active"}
            onClick={() => setActiveTab(1)}
          >
            Design
          </ControlTab>
        )}
        {user && (
          <ControlTab
            className={activeTab === 2 && "is-active"}
            onClick={() => setActiveTab(2)}
          >
            Checkout
          </ControlTab>
        )}
      </ControlTabs>
      {activeTab === 0 && (
        <>
          <ControlsContent>
            <Templatesbar
              pageData={pageData}
              setPageData={setPageData}
            />
          </ControlsContent>
          <ControlsFooter>
            <Button
              backgroundcolor={colors.gray.nineHundred}
              borderradius="0"
              color={colors.gray.oneHundred}
              padding="1rem"
              width="100%"
              disabled={!pageData.template}
              onClick={() => handleApplyTemplateButton()}
            >
              Apply template
            </Button>
          </ControlsFooter>
        </>
      )}
      {activeTab === 1 && (
        <>
          <ControlsContent>
            <Controlsbar
              pageData={pageData}
              setPageData={setPageData}
              setShowModal={setShowModal}
            />
          </ControlsContent>
          <ControlsFooter>
            <Button
              backgroundcolor={colors.gray.nineHundred}
              borderradius="0"
              color={colors.gray.oneHundred}
              padding="1rem"
              width="100%"
              disabled={!pageData.template}
              onClick={() => handleApplyTemplateButton()}
            >
              Apply template
            </Button>
          </ControlsFooter>
        </>
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
