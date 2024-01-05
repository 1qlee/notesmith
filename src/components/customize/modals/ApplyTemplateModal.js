import React, { useState } from "react"
import styled from "styled-components"
import { colors, fonts } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"
import { set, ref, push, query, remove, get, orderByChild, equalTo } from "firebase/database"
import { WarningCircle, Circle, ArrowsHorizontal, CircleNotch, RadioButton } from "@phosphor-icons/react"
import { v4 as uuidv4 } from 'uuid'

import { StyledFieldset, StyledLabel, RadioInput, StyledInput } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import Notification from "../../ui/Notification"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import { Col, Row } from "react-grid-system"

const PageRangeWrapper = styled.div`
  display: flex;
  border: 1px solid ${colors.gray.threeHundred};
  padding: 4px;
  align-items: center;
  border-radius: 4px;
  background-color: ${colors.white};
  transition: transform 0.2s, box-shadow 0.2s;
  width: 6.875rem;
  margin: 0 0 1rem 1.5rem;
  &.is-focused {
    border-color: ${colors.primary.sixHundred};
  }
`

const PageRangeInput = styled.input`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  text-align: center;
  font-family: ${fonts.secondary};
  font-size: 0.75rem;
  width: 2.5rem;
  &:hover,
  &:focus {
    background-color: ${colors.gray.oneHundred};
  }
  &:focus {
    outline: none;
  }
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
  canvasPages,
  canvasPageTemplates,
  pageData,
  productData,
  selectedPage,
  selectedPageSvg,
  setCanvasPages,
  setCanvasPageTemplates,
  setPageData,
  setShowModal,
  toast,
  user,
}) {
  const { firebaseDb } = useFirebaseContext()
  const totalPages = productData.numOfPages
  const [selectedApply, setSelectedApply] = useState("apply-current")
  const [frequency, setFrequency] = useState("")
  const [frequencyNum, setFrequencyNum] = useState(2)
  const [lowerPageBound, setLowerPageBound] = useState(selectedPage || 1)
  const [upperPageBound, setUpperPageBound] = useState(totalPages / 2)
  const [rangeIsFocused, setRangeIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleTemplateApply() {
    setLoading(true)

    if (!selectedApply) {
      toast.error("No choices were selected.")
    }
    else {
      applyTemplate(selectedApply)
    }
  }

  async function applyTemplate(value) {
    // clone the canvasPages array
    const pageNumber = parseInt(selectedPage) - 1
    const canvasPagesClone = [...canvasPages]
    const newPageSvg = selectedPageSvg.outerHTML
    let newPageId

    if (!user) {
      // create a new id for the template
      const newTemplateId = uuidv4()
      // create a page object so that it can be referenced
      const demoPagesObject = {
        [newTemplateId]: newPageSvg,
      }

      // set the new template to state
      setCanvasPageTemplates({
        ...canvasPageTemplates,
        ...demoPagesObject,
      })

      // save the page id to variable
      newPageId = newTemplateId
    }
    else {
      // create a new ref for the new page
      const newPageKey = push(ref(firebaseDb, "pages")).key

      // insert new page into pages table
      set(ref(firebaseDb, `pages/${newPageKey}`), {
        bookId: bookId,
        id: newPageKey,
        svg: newPageSvg,
        uid: user.uid,
        svgHeight: pageData.maxContentHeight || pageData.dimensions.height,
        svgWidth: pageData.maxContentWidth || pageData.dimensions.width, 
        marginTop: pageData.marginTop,
        marginRight: pageData.marginRight,
        marginBottom: pageData.marginBottom,
        marginLeft: pageData.marginLeft,
      })

      // set the new template to state
      setCanvasPageTemplates({
        ...canvasPageTemplates,
        [newPageKey]: {
          id: newPageKey,
          svg: newPageSvg,
          svgHeight: pageData.maxContentHeight || pageData.dimensions.height,
          svgWidth: pageData.maxContentWidth || pageData.dimensions.width, 
          marginTop: pageData.marginTop,
          marginRight: pageData.marginRight,
          marginBottom: pageData.marginBottom,
          marginLeft: pageData.marginLeft,
        },
      })

      // save the page id to variable
      newPageId = newPageKey
    }

    // switch function to apply template to the user's desired pages
    switch(value) {
      case "apply-current":
        // change the corresponding page's svg in our cloned array
        canvasPagesClone[pageNumber].pageId = newPageId
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
                canvasPagesClone[i - 1].pageId = newPageId
              }
              break
            case "odd":
              if (i % 2 !== 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].pageId = newPageId
              }
              break
            case "other":
              if (i % frequencyNum === 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].pageId = newPageId
              }
              break
            default:
              // change the corresponding page's svg in our cloned array
              canvasPagesClone[i - 1].pageId = newPageId
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
                canvasPagesClone[i - 1].pageId = newPageId
              }
              break
            case "odd":
              if (i % 2 !== 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].pageId = newPageId
              }
              break
            case "other":
              if (i % frequencyNum === 0) {
                // change the corresponding page's svg in our cloned array
                canvasPagesClone[i - 1].pageId = newPageId
              }
              break
            default:
              // change the corresponding page's svg in our cloned array
              canvasPagesClone[i - 1].pageId = newPageId
          }
        }
        break
      default:
        break
    }

    // update canvasPages with the updated array clone
    updatePagesDb(canvasPagesClone)
    setPageData({
      ...pageData,
      template: "",
      svgHeight: pageData.maxContentHeight || pageData.dimensions.height,
      svgWidth: pageData.maxContentWidth || pageData.dimensions.width,
      marginTop: pageData.marginTop,
      marginRight: pageData.marginRight,
      marginBottom: pageData.marginBottom,
      marginLeft: pageData.marginLeft,
    })
    toast.success("Updated pages.")

    setLoading(false)
    setShowModal({
      show: false
    })
  }

  // update canvas pages
  async function updatePagesDb(pages) {
    // if user is signed, update pages in db
    if (user) {
      await set(ref(firebaseDb, `books/${bookId}/pages`), pages).then(() => {
        cleanupPagesDb(pages)
      })
    }

    // set pages in state
    setCanvasPages(pages)
  }

  // cleans up non-used pre-existing pages associated with the book
  async function cleanupPagesDb(pages) {
    // get all pages associated with the book
    await get(query(ref(firebaseDb, "pages"), orderByChild("bookId"), equalTo(bookId))).then(async snapshot => {
      const bookPages = snapshot.val()

      // loop through all pages
      for (const page in bookPages) {
        const matchingPageId = bookPages[page].id
        // look for matching page id's in canvasPages
        const pageExists = pages.find(page => page.pageId === matchingPageId)

        // if there is no match, delete the page from the db
        if (!pageExists) {
          // get all order items associated with the book
          // we need to make sure we are not deleting pages from unfulfilled orders
          const orderExists = await get(query(ref(firebaseDb, `orderItems`), orderByChild("bookId"), equalTo(bookId))).then(snapshot => {
            if (snapshot.exists()) {
              const allOrderItems = snapshot.val()
              // filter allOrderItems where printed is false and return original object in an array
              const unfulfilledOrderItems = Object.values(allOrderItems).filter(orderItem => orderItem["printed"] === false)

              // loop through all order items
              for (let orderItem in unfulfilledOrderItems) {
                const { pages } = unfulfilledOrderItems[orderItem]
                // check if the page id matches any of the pages in the order item
                const idMatches = pages.some(page => page.pageId === matchingPageId)

                if (idMatches) {
                  return true
                }
              }

              return false
            }
            else {
              return false
            }
          })

          if (!orderExists) {
            await remove(ref(firebaseDb, `pages/${matchingPageId}`))
          }
        }
      }
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
    >
      <ModalHeader>Apply template to pages</ModalHeader>
      <ModalContent>
        <Notification
          align="flex-start"
          margin="0 0 1rem"
          className="has-no-style"
          backgroundcolor={colors.gray.oneHundred}
          padding="16px"
        >
          <Icon
            borderradius="100%"
            margin="4px 1rem 0 0"
            className="is-pulsating"
            pulseColor={colors.gray.sixHundred}
          >
            <WarningCircle size="1.5rem" weight="fill" color={colors.gray.nineHundred} />
          </Icon>
          <p>Applying a template will remove all existing layouts and styles from these pages.</p>
        </Notification>
        <Row>
          <Col>
            <StyledFieldset
              flexdirection="column"
              margin="0 0 2rem 0"
            >
              <StyledLabel>Apply to</StyledLabel>
              <RadioInput
                margin="0 0 8px 0"
              >
                <input
                  id="apply-current"
                  name="apply-current"
                  type="radio"
                  value="apply-current"
                  onClick={e => handleTemplateSelect(e.target.value)}
                />
                <label htmlFor="apply-current">
                  <Icon margin="0 8px 0 0">
                    {selectedApply === "apply-current" ? (
                      <RadioButton weight="fill" color={colors.gray.nineHundred} size={18} />
                    ) : (
                      <Circle weight="regular" color={colors.gray.nineHundred} size={18} />
                    )}
                  </Icon>
                  <span>Current page only</span>
                </label>
              </RadioInput>
              <RadioInput
                margin="0 0 8px 0"
              >
                <input
                  id="apply-all"
                  name="apply-all"
                  type="radio"
                  value="apply-all"
                  onClick={e => handleTemplateSelect(e.target.value)}
                />
                <label htmlFor="apply-all">
                  <Icon margin="0 8px 0 0">
                    {selectedApply === "apply-all" ? (
                      <RadioButton weight="fill" color={colors.gray.nineHundred} size={18} />
                    ) : (
                      <Circle weight="regular" color={colors.gray.nineHundred} size={18} />
                    )}
                  </Icon>
                  <span>All pages</span>
                </label>
              </RadioInput>
              <RadioInput
                margin="0 0 8px 0"
              >
                <input
                  id="apply-range"
                  name="apply-range"
                  type="radio"
                  value="apply-range"
                  onClick={e => handleTemplateSelect(e.target.value)}
                />
                <label htmlFor="apply-range">
                  <Icon margin="0 8px 0 0">
                    {selectedApply === "apply-range" ? (
                      <RadioButton weight="fill" color={colors.gray.nineHundred} size={18} />
                    ) : (
                      <Circle weight="regular" color={colors.gray.nineHundred} size={18} />
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
                    margin="2px 4px 0"
                  >
                    <ArrowsHorizontal weight="regular" color={colors.gray.nineHundred} size={16} />
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
          </Col>
          {(selectedApply === "apply-all" || selectedApply === "apply-range") && (
            <Col>
              <StyledFieldset
                flexdirection="column"
                margin="0 0 2rem 0"
              >
                <StyledLabel>Frequency (optional)</StyledLabel>
                <RadioInput
                  margin="0 0 8px 0"
                >
                  <input
                    id="apply-even"
                    name="apply-even"
                    type="radio"
                    value="apply-even"
                    onClick={e => handleFrequencySelect("even")}
                  />
                  <label htmlFor="apply-even">
                    <Icon margin="0 8px 0 0">
                      {frequency === "even" ? (
                        <RadioButton weight="fill" color={colors.gray.nineHundred} size={18} />
                      ) : (
                        <Circle weight="regular" color={colors.gray.nineHundred} size={18} />
                      )}
                    </Icon>
                    <span>Even pages</span>
                  </label>
                </RadioInput>
                <RadioInput
                  margin="0 0 8px 0"
                >
                  <input
                    id="apply-odd"
                    name="apply-odd"
                    type="radio"
                    value="apply-odd"
                    onClick={e => handleFrequencySelect("odd")}
                  />
                  <label htmlFor="apply-odd">
                    <Icon margin="0 8px 0 0">
                      {frequency === "odd" ? (
                        <RadioButton weight="fill" color={colors.gray.nineHundred} size={18} />
                      ) : (
                        <Circle weight="regular" color={colors.gray.nineHundred} size={18} />
                      )}
                    </Icon>
                    <span>Odd pages</span>
                  </label>
                </RadioInput>
                <RadioInput
                  margin="0 0 8px 0"
                >
                  <input
                    id="apply-other"
                    name="apply-other"
                    type="radio"
                    value="apply-other"
                    onClick={e => handleFrequencySelect("other")}
                  />
                  <label htmlFor="apply-other">
                    <Icon margin="0 8px 0 0">
                      {frequency === "other" ? (
                        <RadioButton weight="fill" color={colors.primary.sixHundred} size={18} />
                      ) : (
                        <Circle weight="regular" color={colors.gray.nineHundred} size={18} />
                      )}
                    </Icon>
                    <span>Every</span>
                    <StyledInput
                      type="number"
                      padding="4px 8px"
                      width="3.5rem"
                      margin="0 4px"
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
            </Col>
          )}
        </Row>
      </ModalContent>
      <ModalFooter
        justify="flex-end"
      >
        <Button
          backgroundcolor={colors.gray.oneHundred}
          color={colors.gray.nineHundred}
          padding="8px"
          margin="0 8px 0"
          onClick={() => setShowModal({
            show: false,
          })}
        >
          Cancel
        </Button>
        <Button
          padding="8px"
          onClick={() => handleTemplateApply()}
          className={loading ? "is-loading" : null}
          disabled={loading || !selectedApply}
        >
          {loading ? (
            <Icon width="3rem">
              <CircleNotch size="1rem" />
            </Icon>
          ) : (
            "Confirm"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ApplyTemplateModal
