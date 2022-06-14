import React, { useRef } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

import { StyledFieldset, StyledLabel, StyledInput, StyledRange, NumberInput } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import AlignmentControls from "./AlignmentControls"
import { validateInput, validateOnBlur, validateOnKeydown, validateMinValue } from "./template-functions"

function CrossGridControls({
  canvasPageSize,
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setPageData,
}) {
  const totalHorizontalMargin = convertToMM(pageData.pageWidth - pageContentSize.width)
  const centeredHorizontalMargin = convertFloatFixed(totalHorizontalMargin / 2, 3)
  const totalVerticalMargin = convertToMM(pageData.pageHeight - pageContentSize.height)
  const centeredVerticalMargin = convertFloatFixed(totalVerticalMargin / 2, 3)
  const bottomAlignedMargin = convertFloatFixed(centeredVerticalMargin * 2, 3)

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: 0,
        })
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: centeredHorizontalMargin,
        })
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: totalHorizontalMargin,
        })
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: 0,
        })
        break
      case "middle":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: centeredVerticalMargin,
        })
        break
      case "bottom":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: bottomAlignedMargin,
        })
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
          <NumberInput
            value={pageData.rows}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              rows: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
          width="33%"
        >
          <StyledLabel>Columns</StyledLabel>
          <NumberInput
            value={pageData.columns}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              columns: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          width="33%"
        >
          <StyledLabel>Spacing</StyledLabel>
          <NumberInput
            value={pageData.spacing}
            min={0}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              alignmentVertical: "",
              spacing: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
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
          <NumberInput
            value={pageData.marginTop}
            min={0}
            max={maximumMarginHeight}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginTop: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          width="50%"
        >
          <StyledLabel>Left margin</StyledLabel>
          <NumberInput
            value={pageData.marginLeft}
            min={0}
            max={maximumMarginWidth}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginLeft: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
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
          <NumberInput
            value={pageData.opacity}
            min={0.5}
            max={1}
            onChange={value => setPageData({
              ...pageData,
              opacity: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.01}
            width="4.25rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min={0.5}
              step={0.01}
              max={1}
              value={pageData.opacity}
              onChange={e => setPageData({
                ...pageData,
                opacity: e.target.value,
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
        <StyledLabel>Cross size</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <NumberInput
            value={pageData.size}
            min={1}
            max={5}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              alignmentHorizontal: "",
              size: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.01}
            width="4.25rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min={1}
              step={0.01}
              max={5}
              value={pageData.size}
              onChange={e => setPageData({
                ...pageData,
                size: e.target.value,
                alignmentVertical: "",
                alignmentHorizontal: "",
              })}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default CrossGridControls
