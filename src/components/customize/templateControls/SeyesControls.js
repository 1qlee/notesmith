import React, { useRef } from "react"
import { convertToMM, convertToPx, convertFloatFixed } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput, StyledLabel, StyledRange } from "../../form/FormComponents"
import { validateOnBlur, validateMinValue } from "./template-functions"
import AlignmentControls from "./AlignmentControls"

function SeyesControls({
  canvasPageSize,
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setPageData,
}) {
  const { columns, rows, thickness, spacing } = pageData
  const pageHeight = convertToMM(pageData.pageHeight)
  const pageWidth = convertToMM(pageData.pageWidth)
  const contentWidth = (columns - 1) * spacing * 4 + columns * thickness
  const totalHorizontalMargin = pageWidth - contentWidth
  const centeredHorizontalMargin = convertFloatFixed(totalHorizontalMargin / 2, 3) // half of total horizontal margin is center
  const rightAlignedHorizontalMargin = convertFloatFixed(totalHorizontalMargin - thickness * 2, 3)
  const totalVerticalMargin = pageData.pageHeight - pageContentSize.height - convertToPx(pageData.thickness * 2) // subtract content height from page height (in pixels)
  const centeredVerticalMargin = convertToMM(totalVerticalMargin / 2) // half of total vertical margin is center (convert back to MM)
  const bottomMargin = convertToMM(totalVerticalMargin)

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
          marginLeft: centeredHorizontalMargin,
        })
        marginLeftInput.current.value = centeredHorizontalMargin
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: rightAlignedHorizontalMargin,
        })
        marginLeftInput.current.value = rightAlignedHorizontalMargin
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
          marginTop: centeredVerticalMargin,
        })
        marginTopInput.current.value = centeredVerticalMargin
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
              rows: parseInt(value),
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
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
              columns: parseInt(value),
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
              spacing: convertFloatFixed(value, 3),
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
              marginTop: convertFloatFixed(value, 3),
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginTop: convertFloatFixed(value, 3),
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
              alignmentHorizontal: "",
              marginLeft: convertFloatFixed(value, 3),
            }), maximumMarginWidth)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginLeft: convertFloatFixed(value, 3),
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
            onChange={e => validateMinValue(e.target.value, 0.5, value => setPageData({
              ...pageData,
              opacity: parseFloat(value),
            }), 1)}
            type="number"
            min="0.5"
            step="0.01"
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
              step="0.01"
              max="1"
              value={pageData.opacity}
              onChange={e => setPageData({
                ...pageData,
                opacity: parseFloat(e.target.value)
              })}
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
            onChange={e => validateMinValue(e.target.value, 0.088, value => setPageData({
              ...pageData,
              thickness: parseFloat(value),
            }), 3)}
            type="number"
            min="0.088"
            step="0.001"
            max="3"
            padding="0.5rem"
            width="4.25rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min="0.088"
              step="0.001"
              max="3"
              value={pageData.thickness}
              onChange={e => setPageData({
                ...pageData,
                thickness: parseFloat(e.target.value),
              })}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default SeyesControls
