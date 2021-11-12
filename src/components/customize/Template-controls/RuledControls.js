import React, { useRef } from "react"
import { convertToPx, convertToMM } from "../../../styles/variables"

import { StyledFieldset, StyledInput, StyledLabel, StyledRange } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import AlignmentControls from "./AlignmentControls"
import RestrictedInput from "./RestrictedInput"

function RuledControls({ pageData, setPageData, pageSize }) {
  const lineWidth = pageData.pageWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight)
  const horizontalMargin = (pageData.pageWidth - lineWidth) / 2
  const lineHeight = convertToPx((pageData.rows - 1) * pageData.spacing)
  const verticalMargin = (pageData.pageHeight - lineHeight) / 2
  const bottomMargin = pageData.pageHeight - lineHeight - convertToPx(3.175) - 1

  const marginTopInput = useRef(null)
  const marginRightInput = useRef(null)
  const marginLeftInput = useRef(null)

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: 3.175,
          marginRight: convertToMM(pageData.pageWidth - lineWidth - convertToPx(3.175)),
        })
        marginLeftInput.current.value = 3.175
        marginRightInput.current.value = convertToMM(pageData.pageWidth - lineWidth - convertToPx(3.175))
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginRight: 3.175,
          marginLeft: convertToMM(pageData.pageWidth - lineWidth - convertToPx(3.175)),
        })
        marginLeftInput.current.value = convertToMM(pageData.pageWidth - lineWidth - convertToPx(3.175))
        marginRightInput.current.value = 3.175
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: convertToMM(horizontalMargin),
          marginRight: convertToMM(horizontalMargin),
        })
        marginLeftInput.current.value = convertToMM(horizontalMargin)
        marginRightInput.current.value = convertToMM(horizontalMargin)
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: 3.175,
        })
        marginTopInput.current.value = 3.175
        break
      case "middle":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertToMM(verticalMargin),
        })
        marginTopInput.current.value = convertToMM(verticalMargin)
        break
      case "bottom":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertToMM(bottomMargin),
        })
        marginTopInput.current.value = convertToMM(bottomMargin)
        break
      default:
        break
    }
  }

  function validateInput(value, limit) {
    if (value < limit) {
      return false
    }
    else {
      return true
    }
  }

  function validateOnBlur(e, limit, cb) {
    const { value } = e.target

    if (validateInput(value, limit)) {
      return cb(value)
    }
    else {
      e.target.value = limit
      return cb(limit)
    }
  }

  function validateOnKeydown(e, limit, cb) {
    const { value } = e.target
    // if Enter or ESC
    if (e.keyCode === 13 || e.keyCode === 27) {
      e.target.blur()

      if (validateInput(value, limit)) {
        return cb(value)
      }
      else {
        e.target.value = limit
        return cb(limit)
      }
    }
  }

  function validateMinValue(value, minValue, cb, maxValue) {
    if (value <= minValue) {
      return cb(minValue)
    }
    else if (value > maxValue) {
      return cb(maxValue)
    }
    else {
      return cb(value)
    }
  }

  return (
    <>
      <AlignmentControls
        pageData={pageData}
        setPageData={setPageData}
        changeAlignment={changeAlignment}
      />
      <Flexbox
        flex="flex"
        alignitems="center"
        margin="0 0 1rem"
      >
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
          width="50%"
        >
          <StyledLabel>Lines</StyledLabel>
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={pageData.rows}
            padding="0.5rem"
            width="100%"
            onChange={e => validateMinValue(e.target.value, 1, value => setPageData({
              ...pageData,
              alignmentVertical: "",
              rows: value,
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
          width="50%"
        >
          <StyledLabel>Spacing</StyledLabel>
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={pageData.spacing}
            padding="0.5rem"
            width="100%"
            onChange={e => validateMinValue(e.target.value, 1, value => setPageData({
              ...pageData,
              alignmentVertical: "",
              spacing: value
            }))}
          />
        </Flexbox>
      </Flexbox>
      <Flexbox
        flex="flex"
        alignitems="center"
        margin="0 0 1rem 0"
      >
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Top margin</StyledLabel>
          <StyledInput
            ref={marginTopInput}
            type="number"
            step="1"
            padding="0.5rem"
            width="100%"
            defaultValue={pageData.marginTop}
            onBlur={e => validateOnBlur(e, 3.175, value => setPageData({ ...pageData, alignmentVertical: "", marginTop: value }))}
            onKeyDown={e => validateOnKeydown(e, 3.175, value => setPageData({ ...pageData, alignmentVertical: "", marginTop: value }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Left margin</StyledLabel>
          <StyledInput
            ref={marginLeftInput}
            type="number"
            step="1"
            padding="0.5rem"
            width="100%"
            defaultValue={pageData.marginLeft}
            onBlur={e => validateOnBlur(e, 3.175, value => setPageData({...pageData, alignmentHorizontal: "", marginLeft: value}))}
            onKeyDown={e => validateOnKeydown(e, 3.175, value => setPageData({ ...pageData, alignmentVertical: "", marginLeft: value }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Right margin</StyledLabel>
          <StyledInput
            ref={marginRightInput}
            type="number"
            step="1"
            padding="0.5rem"
            width="100%"
            defaultValue={pageData.marginRight}
            onBlur={e => validateOnBlur(e, 3.175, value =>setPageData({...pageData, alignmentHorizontal: "", marginRight: value}))}
            onKeyDown={e => validateOnKeydown(e, 3.175, value => setPageData({ ...pageData, alignmentVertical: "", marginRight: value }))}
          />
        </Flexbox>
      </Flexbox>
      <Flexbox
        flex="flex"
        flexdirection="column"
        margin="0 0 1rem 0"
      >
        <StyledLabel>Opacity</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <StyledInput
            value={pageData.opacity}
            onChange={e => validateMinValue(e.target.value, 0.2, value => setPageData({...pageData, opacity: value}), 1)}
            type="number"
            min="0.2"
            step="0.1"
            max="1"
            padding="0.5rem"
            width="4rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min="0.2"
              step="0.1"
              max="1"
              value={pageData.opacity}
              onChange={e => setPageData({...pageData, opacity: e.target.value})}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
      <Flexbox
        flex="flex"
        flexdirection="column"
        margin="0 0 1rem 0"
      >
        <StyledLabel>Thickness</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <StyledInput
            value={pageData.thickness}
            onChange={e => validateMinValue(e.target.value, 0.3, value => setPageData({...pageData, thickness: value}), 5)}
            type="number"
            min="0.3"
            step="0.1"
            max="5"
            padding="0.5rem"
            width="4rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min="0.3"
              step="0.1"
              max="5"
              value={pageData.thickness}
              onChange={e => setPageData({...pageData, thickness: e.target.value})}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default RuledControls
