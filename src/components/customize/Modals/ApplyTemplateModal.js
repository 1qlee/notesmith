import React, { useState } from "react"
import styled from "styled-components"
import "../../../styles/toastify.css"
import { colors } from "../../../styles/variables"
import { svgToObjects } from "../../../utils/helper-functions"
import { ToastContainer, toast } from 'react-toastify'
import { useFirebaseContext } from "../../../utils/auth"
import { WarningCircle, CheckCircle, Circle, ArrowRight } from "phosphor-react"
import Loading from "../../../assets/loading.svg"

import { StyledFieldset, StyledLabel, RadioInput, StyledInput } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Grid, Cell } from "styled-css-grid"
import Notification from "../../ui/Notification"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

const PageRangeWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.threeHundred};
  padding: 0.25rem;
  align-items: center;
  border-radius: 0.25rem;
  background-color: ${colors.white};
  transition: transform 0.2s, box-shadow 0.2s;
  width: 6.875rem;
  margin: 0 0 1rem 1.5rem;
  &.is-focused {
    border-color: ${colors.primary.sixHundred};
  }
`

const PageRangeInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  text-align: center;
  width: 2.5rem;
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
  bookId,
  bookData,
  pageData,
  canvasPages,
  setCanvasPages,
  setShowModal,
  selectedPage,
  selectedPageSvg,
  user,
}) {
  const { firebaseDb } = useFirebaseContext()
  const totalPages = parseInt(bookData.numOfPages)
  const [selectedApply, setSelectedApply] = useState("apply-current")
  const [frequency, setFrequency] = useState("")
  const [frequencyNum, setFrequencyNum] = useState(2)
  const [lowerPageBound, setLowerPageBound] = useState(selectedPage || 1)
  const [upperPageBound, setUpperPageBound] = useState(totalPages / 2)
  const [rangeIsFocused, setRangeIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleTemplateApply(value) {
    setLoading(true)

    // have to purposely delay applyTemplate() because it freezes the UI
    // preventing the loading state from occuring
    setTimeout(() => {
      applyTemplate(value)
    }, 10)
  }

  // simple function to update a specific page's svg field in the database
  // requires a pageId and a SVG string
  function updatePageSvg(pageId, newPageSvg) {
    const updates = {}
    updates[`/pages/${pageId}/svg`] = newPageSvg

    return firebaseDb.ref().update(updates, error => {
      if (error) {
        console.log(error)
      }
    })
  }

  async function applyTemplate(value) {
    // clone the canvasPages array
    const pageNumber = parseInt(selectedPage) - 1
    const canvasPagesClone = [...canvasPages]
    const newPageSvg = svgToObjects(selectedPageSvg, 0)

    switch(value) {
      case "apply-current":
        // change the corresponding page's svg in our cloned array
        canvasPagesClone[pageNumber].svg = newPageSvg
        // update the svg field for this entry in the firebase db
        await updatePageSvg(canvasPagesClone[pageNumber].pageId, newPageSvg)
        break
      case "apply-range":
        // change the corresponding page's svg in our cloned array
        // simple loop from lower to upper page bound
        for (let i = lowerPageBound; i <= upperPageBound; i++) {
          // check if a frequency is checked
          switch(frequency) {
            case "even":
              if (i % 2 === 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].svg = newPageSvg
                // update the svg field for each appropriate page in the firebase db
                await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
              }
              break
            case "odd":
              if (i % 2 !== 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].svg = newPageSvg
                // update the svg field for each appropriate page in the firebase db
                await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
              }
              break
            case "other":
              if (i % frequencyNum === 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].svg = newPageSvg
                // update the svg field for each appropriate page in the firebase db
                await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
              }
              break
            default:
              // change the corresponding page's svg in our cloned array
              canvasPagesClone[i - 1].svg = newPageSvg
              // update the svg field for each appropriate page in the firebase db
              await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
          }
        }
        break
      case "apply-all":
        // change the corresponding page's svg in our cloned array
        // loop across all pages
        for (let i = 1; i <= totalPages; i++) {
          // for if a frequency is checked
          switch(frequency) {
            case "even":
              if (i % 2 === 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].svg = newPageSvg
                // update the svg field for each appropriate page in the firebase db
                await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
              }
              break
            case "odd":
              if (i % 2 !== 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].svg = newPageSvg
                // update the svg field for each appropriate page in the firebase db
                await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
              }
              break
            case "other":
              if (i % frequencyNum === 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].svg = newPageSvg
                // update the svg field for each appropriate page in the firebase db
                await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
              }
              break
            default:
              // change the corresponding page's svg in our cloned array
              canvasPagesClone[i - 1].svg = newPageSvg
              // update the svg field for each appropriate page in the firebase db
              await updatePageSvg(canvasPagesClone[i - 1].pageId, newPageSvg)
          }
        }
        break
      default:
        break
    }

    // update canvasPages with the updated array clone
    setCanvasPages(canvasPagesClone)
    toast.success("Succesfully updated pages!")

    setLoading(false)
    setShowModal({
      show: false
    })
  }

  function handleTemplateSelect(value) {
    if (selectedApply === value) {
      setSelectedApply("")
    }
    else {
      setSelectedApply(value)
    }
  }

  function handleFrequencySelect(value) {
    if (frequency === value) {
      setFrequency("")
    }
    else {
      setFrequency(value)
    }
  }

  function validateLowerPageBound(value) {
    const pageNumber = parseInt(value)
    if (pageNumber < 1) {
      setLowerPageBound(1)
    }
    else if (pageNumber > totalPages) {
      setLowerPageBound(totalPages)
    }
    else if (pageNumber > upperPageBound) {
      setLowerPageBound(pageNumber)
      setUpperPageBound(pageNumber)
    }
    else {
      setLowerPageBound(pageNumber)
    }
  }

  function validateUpperPageBound(value) {
    const pageNumber = parseInt(value)
    if (pageNumber < 1) {
      setUpperPageBound(1)
    }
    else if (pageNumber > totalPages) {
      setUpperPageBound(totalPages)
    }
    else if (pageNumber < lowerPageBound) {
      setLowerPageBound(pageNumber)
      setUpperPageBound(pageNumber)
    }
    else {
      setUpperPageBound(pageNumber)
    }
  }

  return (
    <Modal
      setShowModal={setShowModal}
      width="300px"
    >
      <ModalHeader>Apply template to pages</ModalHeader>
      <ModalContent>
        <Notification
          backgroundcolor={colors.red.twoHundred}
          bordercolor={colors.red.twoHundred}
          margin="0 0 2rem"
          padding="1rem"
        >
          <Icon
            backgroundcolor={colors.red.twoHundred}
            borderradius="100%"
            margin="0 1rem 0 0"
            className="is-pulsating"
            pulseColor={colors.red.threeHundred}
          >
            <WarningCircle size="1.5rem" weight="fill" color={colors.red.sixHundred} />
          </Icon>
          <Content
            paragraphcolor={colors.red.nineHundred}
          >
            <p>Applying a template will remove all existing layouts and styles from these pages.</p>
            {user ? (
              null
            ) : (
              <p>
                Note: This feature is not available in demo mode.
              </p>
            )}
          </Content>
        </Notification>
        <Grid
          columns={2}
        >
          <Cell
            width={1}
          >
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
                  name="apply-current"
                  type="radio"
                  value="apply-current"
                  onClick={e => handleTemplateSelect(e.target.value)}
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
                  name="apply-all"
                  type="radio"
                  value="apply-all"
                  onClick={e => handleTemplateSelect(e.target.value)}
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
                  name="apply-range"
                  type="radio"
                  value="apply-range"
                  onClick={e => handleTemplateSelect(e.target.value)}
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
                <PageRangeWrapper className={rangeIsFocused ? "is-focused" : null}>
                  <PageRangeInput
                    type="number"
                    onChange={e => setLowerPageBound(e.target.value)}
                    onBlur={e => {
                      setRangeIsFocused(false)
                      validateLowerPageBound(e.target.value)
                    }}
                    onFocus={() => setRangeIsFocused(true)}
                    onClick={e => e.target.select()}
                    value={lowerPageBound}
                    max={totalPages}
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
                    onBlur={e => {
                      setRangeIsFocused(false)
                      validateUpperPageBound(e.target.value)
                    }}
                    onFocus={() => setRangeIsFocused(true)}
                    onClick={e => e.target.select()}
                    value={upperPageBound}
                    max={totalPages}
                    min="1"
                    placeholder={totalPages / 2}
                  />
                </PageRangeWrapper>
              )}
            </StyledFieldset>
          </Cell>
          <Cell
            width={1}
          >
            <StyledFieldset
              flexdirection="column"
              margin="0 0 2rem 0"
            >
              <StyledLabel>Frequency</StyledLabel>
              <RadioInput
                margin="0 0 0.5rem 0"
              >
                <input
                  id="apply-even"
                  name="apply-even"
                  type="radio"
                  value="apply-even"
                  onClick={e => handleFrequencySelect("even")}
                />
                <label htmlFor="apply-even">
                  <Icon margin="0 0.5rem 0 0">
                    {frequency === "even" ? (
                      <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                    ) : (
                      <Circle weight="regular" color={colors.link.normal} size={18} />
                    )}
                  </Icon>
                  <span>Even pages</span>
                </label>
              </RadioInput>
              <RadioInput
                margin="0 0 0.5rem 0"
              >
                <input
                  id="apply-odd"
                  name="apply-odd"
                  type="radio"
                  value="apply-odd"
                  onClick={e => handleFrequencySelect("odd")}
                />
                <label htmlFor="apply-odd">
                  <Icon margin="0 0.5rem 0 0">
                    {frequency === "odd" ? (
                      <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                    ) : (
                      <Circle weight="regular" color={colors.link.normal} size={18} />
                    )}
                  </Icon>
                  <span>Odd pages</span>
                </label>
              </RadioInput>
              <RadioInput
                margin="0 0 0.5rem 0"
              >
                <input
                  id="apply-other"
                  name="apply-other"
                  type="radio"
                  value="apply-other"
                  onClick={e => handleFrequencySelect("other")}
                />
                <label htmlFor="apply-other">
                  <Icon margin="0 0.5rem 0 0">
                    {frequency === "other" ? (
                      <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                    ) : (
                      <Circle weight="regular" color={colors.link.normal} size={18} />
                    )}
                  </Icon>
                  <span>Every</span>
                  <StyledInput
                    type="number"
                    padding="0.25rem 0.5rem"
                    width="3.5rem"
                    margin="0 0.25rem"
                    textalign="center"
                    value={frequencyNum}
                    onChange={e => setFrequencyNum(parseInt(e.target.value))}
                    onFocus={e => setFrequency("other")}
                    onClick={e => e.target.select()}
                    min="1"
                    max={totalPages}
                  />
                  <span>pages</span>
                </label>
              </RadioInput>
            </StyledFieldset>
          </Cell>
        </Grid>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Button
          backgroundcolor={colors.gray.oneHundred}
          padding="0.5rem"
          borderradius="0.25rem"
          margin="0 0.5rem 0"
          onClick={() => setShowModal({
            show: false,
          })}
        >
          Cancel
        </Button>
        {user ? (
          <Button
            backgroundcolor={colors.primary.sixHundred}
            color={colors.primary.white}
            padding="0.5rem"
            borderradius="0.25rem"
            onClick={() => handleTemplateApply(selectedApply)}
            className={loading ? "is-loading" : null}
            disabled={loading}
          >
            {loading ? (
              <Loading height="1rem" width="3rem" />
            ) : (
              "Confirm"
            )}
          </Button>
        ) : (
          null
        )}
      </ModalFooter>
      <ToastContainer
        autoClose={3000}
        closeOnClick
        draggable
        draggablePercent={50}
        hideProgressBar={false}
        limit={3}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-center"
        rtl={false}
        theme="colored"
        style={{
          fontFamily: "Inter, Helvetica, Tahoma, sans-serif",
          fontSize: "0.75rem",
        }}
      />
    </Modal>
  )
}

export default ApplyTemplateModal
