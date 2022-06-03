import React, { useRef } from "react"
import { convertToMM, convertToPx, convertFloatFixed } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput, StyledLabel, StyledRange } from "../../form/FormComponents"
import { validateOnBlur, validateMinValue } from "./template-functions"
import AlignmentControls from "./AlignmentControls"

function HexagonControls({
  canvasPageSize,
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

  const marginTopInput = useRef(null)
  const marginLeftInput = useRef(null)

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: convertFloatFixed(hexWidth, 3),
        })
        marginLeftInput.current.value = convertFloatFixed(hexWidth, 3)
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
          marginLeft: rightHorizontalMargin,
        })
        marginLeftInput.current.value = rightHorizontalMargin
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertFloatFixed(hexHeight, 3),
        })
        marginTopInput.current.value = convertFloatFixed(hexHeight, 3)
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
          marginTop: bottomVerticalMargin,
        })
        marginTopInput.current.value = bottomVerticalMargin
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
          width="50%"
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
            onChange={e => validateMinValue(e.target.value, -pageData.hexagonRadius * 2, value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginTop: parseFloat(value),
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, -pageData.hexagonRadius * 2, value => setPageData({
              ...pageData,
              marginTop: parseFloat(value),
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
        >
          <StyledLabel>Left margin</StyledLabel>
          <StyledInput
            padding="0.5rem"
            ref={marginLeftInput}
            step="1"
            type="number"
            value={pageData.marginLeft.toString()}
            width="100%"
            onChange={e => validateMinValue(e.target.value, -pageData.hexagonRadius * 2, value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginLeft: parseFloat(value),
            }), maximumMarginWidth)}
            onBlur={e => validateOnBlur(e, -pageData.hexagonRadius * 2, value => setPageData({
              ...pageData,
              marginLeft: parseFloat(value),
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
              thickness: parseFloat(value)
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
                thickness: parseFloat(e.target.value)
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
        <StyledLabel>Hex radius</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <StyledInput
            value={pageData.hexagonRadius}
            onChange={e => validateMinValue(e.target.value, 1, value => setPageData({
              ...pageData,
              hexagonRadius: parseFloat(value),
              alignmentVertical: "",
              alignmentHorizontal: "",
            }), 100)}
            type="number"
            min="1"
            max="100"
            step="0.1"
            padding="0.5rem"
            width="4rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min="1"
              step="0.1"
              value={pageData.hexagonRadius}
              onChange={e => setPageData({
                ...pageData,
                hexagonRadius: parseFloat(e.target.value),
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

export default HexagonControls
