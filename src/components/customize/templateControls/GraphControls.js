import React from "react"
import { convertToMM, convertFloatFixed } from "../../../styles/variables"

import { StyledLabel, RangeInput, NumberInput } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import AlignmentControls from "./AlignmentControls"

function GraphControls({
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setPageData,
}) {
  const strokeMargin = pageData.thickness * 2 // the stroke width of two lines must be subtracted from all margin measurements
  const totalHorizontalMargin = convertToMM((pageData.pageWidth - pageContentSize.width) - strokeMargin * 2)
  const centeredHorizontalMargin = convertFloatFixed(totalHorizontalMargin / 2, 3)
  const totalVerticalMargin = convertToMM((pageData.pageHeight - pageContentSize.height) - pageData.thickness / 2)
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
            min={1}
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
        margin="0 0 1rem 0"
      >
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
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
          <RangeInput
            margin="0 0 0 0.5rem"
            width="100%"
            min={0.5}
            step={0.01}
            max={1}
            value={pageData.opacity}
            onChange={e => setPageData({
              ...pageData,
              opacity: e.target.value,
            })}
          />
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
          <NumberInput
            value={pageData.thickness}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              alignmentHorizontal: "",
              thickness: value,
            })}
            min={0.088}
            step={0.01}
            max={3}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            width="4.25rem"
          />
          <RangeInput
            margin="0 0 0 0.5rem"
            width="100%"
            min={0.088}
            step={0.01}
            max={3}
            value={pageData.thickness}
            onChange={e => setPageData({
              ...pageData,
              alignmentVertical: "",
              alignmentHorizontal: "",
              thickness: e.target.value,
            })}
          />
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default GraphControls
