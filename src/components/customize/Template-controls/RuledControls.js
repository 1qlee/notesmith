import React, { useRef } from "react"
import { convertToPx, convertToMM } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import { StyledFieldset, StyledInput, StyledLabel, StyledRange } from "../../form/FormComponents"
import { validateInput, validateOnBlur, validateOnKeydown, validateMinValue } from "./template-functions"
import AlignmentControls from "./AlignmentControls"

function RuledControls({
  pageData,
  setPageData,
  pageSize,
  selectedPage,
}) {
  const pageIsEven = selectedPage % 2 === 0
  const flushMarginLeft = pageIsEven ? 3.175 : 9.525 // even pages have holes on the right side
  const flushMarginRight = pageIsEven ? 9.525 : 3.175 // odd pages have holes on the left side
  const totalMargin = convertToPx(pageData.marginLeft) + convertToPx(pageData.marginRight)
  const centeredMargin = convertToMM(totalMargin / 2)
  const lineWidth = pageData.pageWidth - totalMargin
  const horizontalCenter = convertToMM((pageData.pageWidth - lineWidth - convertToPx(9.525)) / 2)
  const lineHeight = convertToPx((pageData.rows - 1) * pageData.spacing)
  const verticalCenter = convertToMM((pageData.pageHeight - lineHeight) / 2)
  const bottomMargin = convertToMM(pageData.pageHeight - lineHeight - convertToPx(3.175) - 1)
  const remainderMarginRight = convertToMM(pageData.pageWidth - lineWidth - convertToPx(flushMarginLeft))
  const remainderMarginLeft = convertToMM(pageData.pageWidth - lineWidth - convertToPx(flushMarginRight))
  const maximumMargin = convertToMM(pageData.pageHeight)

  const marginTopInput = useRef(null)
  const marginRightInput = useRef(null)
  const marginLeftInput = useRef(null)

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: 0,
        })
        marginLeftInput.current.value = 0
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: centeredMargin,
          marginRight: centeredMargin,
        })
        marginLeftInput.current.value = centeredMargin
        marginRightInput.current.value = centeredMargin
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: remainderMarginLeft,
          marginRight: flushMarginRight,
        })
        marginLeftInput.current.value = remainderMarginLeft
        marginRightInput.current.value = flushMarginRight
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
          marginTop: verticalCenter,
        })
        marginTopInput.current.value = verticalCenter
        break
      case "bottom":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: bottomMargin,
        })
        marginTopInput.current.value = bottomMargin
        break
      default:
        break
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
            value={pageData.marginTop.toString()}
            onChange={e => validateMinValue(e.target.value, 0, value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginTop: value
            }), maximumMargin)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginTop: value
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Left margin</StyledLabel>
          <StyledInput
            padding="0.5rem"
            ref={marginLeftInput}
            step="1"
            type="number"
            value={pageData.marginLeft.toString()}
            width="100%"
            onChange={e => validateMinValue(e.target.value, 0, value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginLeft: value
            }))}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({...pageData, alignmentHorizontal: "", marginLeft: value}))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Right margin</StyledLabel>
          <StyledInput
            padding="0.5rem"
            ref={marginRightInput}
            step="1"
            type="number"
            value={pageData.marginRight.toString()}
            width="100%"
            onChange={e => validateMinValue(e.target.value, 0, value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginRight: value
            }))}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({...pageData, alignmentHorizontal: "", marginRight: value}))}
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
            onChange={e => validateMinValue(e.target.value, 0.5, value => setPageData({...pageData, opacity: value}), 1)}
            type="number"
            min="0.5"
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
              min="0.5"
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
            onChange={e => validateMinValue(e.target.value, 0.175, value => setPageData({...pageData, thickness: value}), 3)}
            type="number"
            min="0.175"
            step="0.1"
            max="3"
            padding="0.5rem"
            width="4rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min="0.175"
              step="0.1"
              max="3"
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
