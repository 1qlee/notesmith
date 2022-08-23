import React from "react"
import { convertToMM, convertFloatFixed } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import { RangeInput, StyledLabel, NumberInput } from "../../form/FormComponents"
import AlignmentControls from "./AlignmentControls"

function HexagonControls({
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setPageData,
}) {
  const { hexagonRadius, thickness } = pageData
  const hexWidth = hexagonRadius * (Math.sqrt(3) / 2) // half of the width of a single hexagon
  const hexHeight = hexagonRadius
  const pageWidth = convertToMM(pageData.pageWidth)
  const pageHeight = convertToMM(pageData.pageHeight)
  const contentWidth = convertToMM(pageContentSize.width)
  const contentHeight = convertToMM(pageContentSize.height)
  const totalHorizontalMargin = pageWidth - contentWidth - thickness * 2 // subtract content from page width to get white space
  const centeredHorizontalMargin = convertFloatFixed(totalHorizontalMargin / 2 + hexWidth, 3) // half of total horizontal margin plus offset from hexWidth
  const rightHorizontalMargin = convertFloatFixed(totalHorizontalMargin + hexWidth, 3)
  const totalVerticalMargin = pageHeight - contentHeight - thickness * 2 // subtract content from page height
  const centeredVerticalMargin = convertFloatFixed(totalVerticalMargin / 2 + hexHeight, 3) // half of total vertical margin plus offset from hexHeight
  const bottomVerticalMargin = convertFloatFixed(totalVerticalMargin + hexHeight, 3)

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: convertFloatFixed(hexWidth, 3),
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
          marginLeft: rightHorizontalMargin,
        })
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertFloatFixed(hexHeight, 3),
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
          marginTop: bottomVerticalMargin,
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
          width="50%"
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
          width="50%"
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
            min={-hexHeight * 2}
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
            min={-hexWidth * 2}
            max={maximumMarginWidth}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
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
        <StyledLabel>Hex radius</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <NumberInput
            max={100}
            min={1}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.1}
            value={pageData.hexagonRadius}
            width="4.25rem"
            onChange={value => setPageData({
              ...pageData,
              hexagonRadius: value,
              alignmentVertical: "",
              alignmentHorizontal: "",
            })}
          />
          <RangeInput
            margin="0 0 0 0.5rem"
            width="100%"
            max={100}
            min={1}
            step={0.1}
            value={pageData.hexagonRadius}
            onChange={e => setPageData({
              ...pageData,
              hexagonRadius: parseFloat(e.target.value),
              alignmentVertical: "",
              alignmentHorizontal: "",
            })}
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
              thickness: e.target.value,
            })}
          />
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default HexagonControls
