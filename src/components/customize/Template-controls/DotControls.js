import React, { useRef } from "react"
import { convertToPx, convertToMM } from "../../../styles/variables"

import { StyledFieldset, StyledLabel, StyledInput, StyledRange } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import AlignmentControls from "./AlignmentControls"
import { validateInput, validateOnBlur, validateOnKeydown, validateMinValue } from "./template-functions"

function DotControls({
  pageData,
  setPageData,
  selectedPageSvg,
  maximumMarginHeight,
  maximumMarginWidth,
}) {
  const templateHeight = selectedPageSvg ? selectedPageSvg.getBoundingClientRect().height : null
  const templateWidth = selectedPageSvg ? selectedPageSvg.getBoundingClientRect().width : null
  const rowWidth = convertToPx((pageData.columns - 1) * pageData.spacing) // the width of one row of dots
  const rowHeight = convertToPx((pageData.rows - 1) * pageData.spacing) // the entire height of all rows of dots
  const topMargin = (pageData.pageHeight - rowHeight) / 2 // the margin at the top when dots are vertically centered
  const sideMargin = (pageData.pageWidth - rowWidth) / 2 // the margin at the top when dots are horizontally centered
  const bottomMargin = pageData.pageHeight - rowHeight - convertToPx(3.34) //
  const rightMargin = pageData.pageWidth - rowWidth - convertToPx(3.34) //

  const marginTopInput = useRef(null)
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
          marginLeft: convertToMM(sideMargin),
        })
        marginLeftInput.current.value = convertToMM(sideMargin)
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: convertToMM(rightMargin),
        })
        marginLeftInput.current.value = convertToMM(rightMargin)
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: 0,
        })
        marginTopInput.current.value = 0
        break
      case "middle":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertToMM(topMargin),
        })
        marginTopInput.current.value = convertToMM(topMargin)
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
          width="33%"
        >
          <StyledLabel>Rows</StyledLabel>
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
          width="33%"
        >
          <StyledLabel>Columns</StyledLabel>
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={pageData.columns}
            padding="0.5rem"
            width="100%"
            onChange={e => validateMinValue(e.target.value, 1, value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              columns: value,
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
          width="33%"
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
              alignmentHorizontal: "",
              alignmentVertical: "",
              spacing: value
            }))}
          />
        </Flexbox>
      </Flexbox>
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
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginTop: value
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
          width="50%"
        >
          <StyledLabel>Left margin</StyledLabel>
          <StyledInput
            ref={marginLeftInput}
            type="number"
            step="1"
            padding="0.5rem"
            width="100%"
            value={pageData.marginLeft.toString()}
            onChange={e => validateMinValue(e.target.value, 0, value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginLeft: value
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginLeft: value
            }))}
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
            onChange={e => setPageData({...pageData, opacity: e.target.value})}
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
        <StyledLabel>Dot radius</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <StyledInput
            value={pageData.dotRadius}
            onChange={e => setPageData({...pageData, dotRadius: e.target.value})}
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
              value={pageData.dotRadius}
              onChange={e => setPageData({...pageData, dotRadius: e.target.value})}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default DotControls
