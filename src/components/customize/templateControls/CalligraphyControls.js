import React from "react"
import { convertToMM, convertFloatFixed, colors } from "../../../styles/variables"
import { Square, CheckSquare, Question } from "phosphor-react"
import ReactTooltip from "react-tooltip"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput, StyledLabel, RangeInput, StyledCheckbox, NumberInput } from "../../form/FormComponents"
import AlignmentControls from "./AlignmentControls"
import Icon from "../../Icon"

function CalligraphyControls({
  canvasPageSize,
  dashedLineData,
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setDashedLineData,
  setPageData,
}) {
  const { marginLeft, marginRight, thickness } = pageData
  const pageHeight = convertToMM(pageData.pageHeight)
  const pageWidth = convertToMM(pageData.pageWidth)
  const contentHeight = convertToMM(pageContentSize.height)
  const contentWidth = convertToMM(pageContentSize.width)
  const totalHorizontalMargin = marginLeft + marginRight // sum of left and right margins
  const centeredHorizontalMargin = convertFloatFixed(totalHorizontalMargin / 2, 3) // half of total horizontal margin is center
  const totalVerticalMargin = convertFloatFixed(pageHeight - contentHeight - thickness * 2, 3) // subtract content height from page height (in pixels)
  const centeredVerticalMargin = convertFloatFixed(totalVerticalMargin / 2, 3) // half of total vertical margin is center (convert back to MM)
  const bottomMargin = totalVerticalMargin

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginRight: totalHorizontalMargin,
          marginLeft: 0,
        })
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: centeredHorizontalMargin,
          marginRight: centeredHorizontalMargin,
        })
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: totalHorizontalMargin,
          marginRight: 0,
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
          marginTop: bottomMargin,
        })
        break
      default:
        break
    }
  }

  function handleDashedLineSync() {
    if (!dashedLineData.sync) {
      setDashedLineData({
        ...dashedLineData,
        sync: true,
        opacity: 1,
        thickness: 0.088,
      })
    }
    else {
      setDashedLineData({
        ...dashedLineData,
        sync: false,
      })
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
        >
          <StyledLabel>Row spacing</StyledLabel>
          <NumberInput
            value={pageData.groupSpacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              groupSpacing: value,
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
        >
          <StyledLabel>Slants</StyledLabel>
          <NumberInput
            value={pageData.slants}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              slants: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Slant spacing</StyledLabel>
          <NumberInput
            value={pageData.slantSpacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              slantSpacing: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
        >
          <StyledLabel>Slant angle</StyledLabel>
          <NumberInput
            value={pageData.slantAngle}
            min={1}
            max={179}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              slantAngle: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
      </Flexbox>
      <Flexbox
        flex="flex"
        alignitems="flex-end"
        margin="0 0 1rem"
      >
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Ascender spacing</StyledLabel>
          <NumberInput
            value={pageData.ascSpacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              ascSpacing: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>X-height</StyledLabel>
          <NumberInput
            value={pageData.xHeight}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              xHeight: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
        >
          <StyledLabel>Descender spacing</StyledLabel>
          <NumberInput
            value={pageData.dscSpacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              dscSpacing: value,
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
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Left margin</StyledLabel>
          <NumberInput
            value={pageData.marginLeft}
            min={0}
            max={maximumMarginWidth - pageData.marginRight - 1}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginLeft: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={1}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
        >
          <StyledLabel>Right margin</StyledLabel>
          <NumberInput
            value={pageData.marginRight}
            min={0}
            max={maximumMarginWidth - pageData.marginLeft - 1}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginRight: value,
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
            min={0.088}
            max={3}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              thickness: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.001}
            width="4.25rem"
          />
          <RangeInput
            margin="0 0 0 0.5rem"
            width="100%"
            min={0.088}
            step={0.001}
            max={3}
            value={pageData.thickness}
            onChange={e => setPageData({
              ...pageData,
              thickness: parseFloat(e.target.value),
            })}
          />
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default CalligraphyControls
