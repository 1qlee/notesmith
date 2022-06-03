import React, { useRef } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

import { StyledFieldset, StyledLabel, StyledInput, StyledRange } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import AlignmentControls from "./AlignmentControls"
import { validateInput, validateOnBlur, validateOnKeydown, validateMinValue } from "./template-functions"

function DotControls({
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
          marginLeft: totalHorizontalMargin,
        })
        marginLeftInput.current.value = totalHorizontalMargin
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
          marginTop: bottomAlignedMargin,
        })
        marginTopInput.current.value = bottomAlignedMargin
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
              rows: parseInt(value),
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
              columns: parseInt(value),
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
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
              spacing: parseFloat(value),
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
              marginTop: parseFloat(value),
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginTop: parseFloat(value),
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
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
              marginLeft: parseFloat(value)
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginLeft: parseFloat(value)
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
              min="0.2"
              step="0.01"
              max="1"
              value={pageData.opacity}
              onChange={e => setPageData({
                ...pageData,
                opacity: parseFloat(e.target.value),
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
        <StyledLabel>Dot radius</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <StyledInput
            value={pageData.dotRadius}
            onChange={e => validateMinValue(e.target.value, 0.02, value => setPageData({
              ...pageData,
              dotRadius: parseFloat(value),
              alignmentVertical: "",
              alignmentHorizontal: "",
            }), 1)}
            type="number"
            min="0.02"
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
              min="0.02"
              step="0.01"
              max="1"
              value={pageData.dotRadius}
              onChange={e => setPageData({
                ...pageData,
                dotRadius: parseFloat(e.target.value),
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

export default DotControls
