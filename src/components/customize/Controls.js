import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { colors, widths } from "../../styles/variables"
import { useEditorContext, useEditorDispatch } from "./context/editorContext"
import { useSettingsContext } from "./context/settingsContext"

import Designbar from "./bars/Designbar"
import Templatesbar from "./bars/Templatesbar"
import Checkoutbar from "./bars/Checkoutbar"

const StyledControls = styled.div`
  border-left: ${colors.borders.black};
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  width: ${widths.sidebar};
  position: absolute;
  right: 0;
  top: 0;
  z-index: 8;
`

const ControlsContent = styled.div`
  background-color: ${colors.white};
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
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

const ControlsTab = styled.button`
  background-color: ${colors.white};
  color: ${colors.gray.sixHundred};
  padding: 4px 16px;
  transition: color 0.2s, background-color 0.2s;
  height: 100%;
  font-size: 0.875rem;
  border: none;
  font-weight: 400;
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
  activePageData,
  activeTab,
  bookData,
  canvasPages,
  dimensions,
  max,
  pageData,
  productData,
  productThumbnails,
  selectedPageSvg,
  setActivePageData,
  setActiveTab,
  setBookData,
  setPageData,
  setShowModal,
  toast,
  user,
}) {
  const settingsState = useSettingsContext()
  const dispatch = useEditorDispatch()
  const canvasState = useEditorContext()

  const handleShowModal = () => {
    dispatch({
      type: "ungroup-selection",
    })
    
    setShowModal({
      show: true,
      type: "template"
    })
  }

  useEffect(() => {
    // if we are displaying a template, show the design bar
    if (pageData.template && pageData.template !== "blank") {
      // show design bar
      setActiveTab(1)
    }
    // else if user is currently drag selecting or done drag selecting elements, show design bar
    if (canvasState.selectionBbox && canvasState.selectionPath) {
      // show design bar
      setActiveTab(1)
    }
  }, [pageData.template, canvasState.tempSelectedElements, canvasState.selectedElements])

  if (!settingsState.view_controls) {
    return
  }

  return (
    <StyledControls>
      <ControlsTabs>
        <ControlsTab
        tabIndex="0"
          className={activeTab === 0 && "is-active"}
          onClick={() => setActiveTab(0)}
        >
          Templates
        </ControlsTab>
        <ControlsTab
        tabIndex="0"
          className={activeTab === 1 && "is-active"}
          onClick={() => setActiveTab(1)}
        >
          Design
        </ControlsTab>
        {user && (
          <ControlsTab
          tabIndex="0"
            className={activeTab === 2 && "is-active"}
            onClick={() => setActiveTab(2)}
          >
            Checkout
          </ControlsTab>
        )}
      </ControlsTabs>
      {activeTab === 0 && (
        <Templatesbar
          handleShowModal={handleShowModal}
          pageData={pageData}
          setPageData={setPageData}
          setShowModal={setShowModal}
          toast={toast}
        />
      )}
      {activeTab === 1 && (
        <Designbar
          activePageData={activePageData}
          dimensions={dimensions}
          handleShowModal={handleShowModal}
          max={max}
          pageData={pageData}
          selectedPageSvg={selectedPageSvg}
          setActivePageData={setActivePageData}
          setPageData={setPageData}
          setShowModal={setShowModal}
        />
      )}
      {activeTab === 2 && (
        <Checkoutbar
          bookData={bookData}
          pageData={pageData}
          canvasPages={canvasPages}
          productData={productData}
          productThumbnails={productThumbnails}
          setBookData={setBookData}
          toast={toast}
        />
      )}
    </StyledControls>
  )
}

export { Controls, ControlsContent, ControlsTabs, ControlsTab, ControlsFooter }
