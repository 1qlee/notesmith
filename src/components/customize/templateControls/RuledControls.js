import React, { useRef } from "react"
import { convertToMM, convertToPx, convertFloatFixed } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput, StyledLabel, StyledRange , NumberInput} from "../../form/FormComponents"
import { validateOnBlur, validateMinValue } from "./template-functions"
import AlignmentControls from "./AlignmentControls"

function RuledControls({
  canvasPageSize,
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setPageData,
}) {
  const { marginLeft, marginRight, thickness } = pageData
  const pageHeight = convertToMM(pageData.pageHeight)
  const pageWidth = convertToMM(pageData.pageWidth)
  const contentHeight = convertToMM(pageContentSize.height)
  const contentWidth = convertToMM(pageContentSize.width)
  const totalHorizontalMargin = convertFloatFixed(marginLeft + marginRight, 3) // sum of left and right margins
  const centeredHorizontalMargin = convertFloatFixed(totalHorizontalMargin / 2, 3) // half of total horizontal margin is center
  const totalVerticalMargin = convertFloatFixed(pageHeight - contentHeight - thickness, 3) // subtract content height from page height
  const centeredVerticalMargin = convertFloatFixed(totalVerticalMargin / 2, 3) // half of total vertical margin is center
  const bottomMargin = convertFloatFixed(centeredVerticalMargin * 2, 3)

  const marginTopInput = useRef(null)
  const marginLeftInput = useRef(null)
  const marginRightInput = useRef(null)

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginRight: totalHorizontalMargin,
          marginLeft: 0,
        })
        marginLeftInput.current.value = 0
        marginRightInput.current.value = totalHorizontalMargin
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: centeredHorizontalMargin,
          marginRight: centeredHorizontalMargin,
        })
        marginLeftInput.current.value = centeredHorizontalMargin
        marginRightInput.current.value = centeredHorizontalMargin
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: totalHorizontalMargin,
          marginRight: 0,
        })
        marginLeftInput.current.value = totalHorizontalMargin
        marginRightInput.current.value = 0
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
        flexdirection="column"
      >
        <StyledLabel>Test</StyledLabel>
        <NumberInput
          currentValue={pageData.test}
          data={pageData}
          max="100"
          min="1"
          onChange={setPageData}
          padding="0.5rem 1.5rem 0.5rem 0.5rem"
          step="1"
          width="4.25rem"
        />
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
              rows: parseInt(value),
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
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
              spacing: parseFloat(value)
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
              marginTop: parseFloat(value)
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginTop: parseFloat(value)
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
              marginLeft: parseFloat(value),
            }), maximumMarginWidth - pageData.marginRight - 1)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginLeft: parseFloat(value),
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
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
              alignmentHorizontal: "",
              marginRight: parseFloat(value),
            }), maximumMarginWidth - pageData.marginLeft - 1)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginRight: parseFloat(value),
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
              alignmentVertical: "",
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
                alignmentVertical: "",
                thickness: parseFloat(e.target.value)
              })}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default RuledControls
