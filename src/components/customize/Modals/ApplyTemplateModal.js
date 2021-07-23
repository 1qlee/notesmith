import React, { useState } from "react"
import styled from "styled-components"
import { WarningCircle, CheckCircle, Circle, ArrowRight } from "phosphor-react"
import { colors } from "../../../styles/variables"

import { StyledFieldset, StyledLabel, RadioInput } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Notification from "../../ui/Notification"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

const PageRangeWrapper = styled.div`
  display: flex;
  box-shadow: 0 1px 2px ${colors.shadow.float};
  align-items: center;
  border-radius: 0.25rem;
  background-color: ${colors.white};
  border: 0.25rem solid ${colors.white};
  width: 6.875rem;
  margin-left: 1.5rem;
`

const PageRangeInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  text-align: center;
  width: 2.5rem;
  &:focus {
    background-color: ${colors.primary.hover};
    box-shadow: none;
    outline: none;
  }
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
`

function ApplyTemplateModal({
  setShowModal,
  selectedPage,
  selectedPageSvg,
}) {
  const [selectedApply, setSelectedApply] = useState("apply-current")
  const [lowerPageBound, setLowerPageBound] = useState(1)
  const [upperPageBound, setUpperPageBound] = useState(12)

  function handleTemplateApply() {
    // get all pages from localStorage
    const pages = JSON.parse(localStorage.getItem("canvas-pages"))
    const pageNumber = selectedPage - 1

    switch(selectedApply) {
      case "apply-current":
        // change the corresponding page's svg
        pages[pageNumber] = selectedPageSvg.outerHTML
        // reset pages in localStorage
        localStorage.setItem("canvas-pages", JSON.stringify(pages))
        break
      case "apply-range":
        for (let i = lowerPageBound; i <= upperPageBound; i++) {
          pages[i - 1] = selectedPageSvg.outerHTML
        }
        localStorage.setItem("canvas-pages", JSON.stringify(pages))
        break
      case "apply-all":
        break
      default:
        break
    }

    // close the modal
    setShowModal({
      show: false
    })
  }

  function validatePageRange(pageNumber, bound) {
    console.log("page #:", pageNumber)
    console.log("lower bound:", lowerPageBound)
    console.log("upper bound:", upperPageBound)
    if (pageNumber < 1) {
      if (bound === "lower") {
        setLowerPageBound(1)
      }
      else {
        setUpperPageBound(1)
      }
    }
    if (pageNumber > 48) {
      if (bound === "lower") {
        setLowerPageBound(48)
      }
      else {
        setUpperPageBound(48)
      }
    }

    if (upperPageBound < lowerPageBound) {
      setLowerPageBound(pageNumber)
      setUpperPageBound(pageNumber)
    }
  }

  return (
    <Modal
      setShowModal={setShowModal}
    >
      <ModalHeader>Apply template to pages</ModalHeader>
      <ModalContent>
        <Notification
          backgroundcolor={colors.paper.cream}
          bordercolor={colors.primary.sixHundred}
          margin="0 0 1rem"
        >
          <Icon
            margin="0 0.5rem 0 0"
          >
            <WarningCircle size="1rem" weight="duotone" color={colors.primary.sixHundred} />
          </Icon>
          <Content>
            <p>Applying a template will remove all existing layouts and styles from these pages.</p>
          </Content>
        </Notification>
        <StyledFieldset
          flexdirection="column"
          margin="0 0 2rem 0"
        >
          <StyledLabel>Apply to</StyledLabel>
          <RadioInput
            margin="0 0 0.5rem 0"
          >
            <input
              id="apply-current"
              name="apply"
              type="radio"
              value="apply-current"
              onChange={e => setSelectedApply(e.target.value)}
            />
            <label htmlFor="apply-current">
              <Icon margin="0 0.5rem 0 0">
                {selectedApply === "apply-current" ? (
                  <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                ) : (
                  <Circle weight="regular" color={colors.link.normal} size={18} />
                )}
              </Icon>
              <span>Current page only</span>
            </label>
          </RadioInput>
          <RadioInput
            margin="0 0 0.5rem 0"
          >
            <input
              id="apply-all"
              name="apply"
              type="radio"
              value="apply-all"
              onChange={e => setSelectedApply(e.target.value)}
            />
            <label htmlFor="apply-all">
              <Icon margin="0 0.5rem 0 0">
                {selectedApply === "apply-all" ? (
                  <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                ) : (
                  <Circle weight="regular" color={colors.link.normal} size={18} />
                )}
              </Icon>
              <span>All pages</span>
            </label>
          </RadioInput>
          <RadioInput
            margin="0 0 0.5rem 0"
          >
            <input
              id="apply-range"
              name="apply"
              type="radio"
              value="apply-range"
              onChange={e => setSelectedApply(e.target.value)}
            />
            <label htmlFor="apply-range">
              <Icon margin="0 0.5rem 0 0">
                {selectedApply === "apply-range" ? (
                  <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                ) : (
                  <Circle weight="regular" color={colors.link.normal} size={18} />
                )}
              </Icon>
              <span>Page range</span>
            </label>
          </RadioInput>
          {selectedApply === "apply-range" && (
            <PageRangeWrapper>
              <PageRangeInput
                type="number"
                onChange={e => setLowerPageBound(e.target.value)}
                onBlur={e => validatePageRange(e.target.value, "lower")}
                value={lowerPageBound}
                max="48"
                min="1"
                placeholder="1"
              />
              <Icon
                margin="0.125rem 0.25rem 0"
              >
                <ArrowRight weight="regular" color={colors.gray.nineHundred} size={14} />
              </Icon>
              <PageRangeInput
                type="number"
                onChange={e => setUpperPageBound(e.target.value)}
                onBlur={e => validatePageRange(e.target.value, "upper")}
                value={upperPageBound}
                max="48"
                min="1"
                placeholder="12"
              />
            </PageRangeWrapper>
          )}
        </StyledFieldset>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.primary.oneHundred}
          padding="0.5rem"
          borderradius="0.25rem"
          margin="0 0.5rem 0"
          onClick={() => setShowModal({
            show: false,
          })}
        >
          Cancel
        </Button>
        <Button
          backgroundcolor={colors.primary.sixHundred}
          color={colors.primary.white}
          padding="0.5rem"
          borderradius="0.25rem"
          onClick={() => handleTemplateApply()}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ApplyTemplateModal
