import React from "react"
import { convertToMM, convertFloatFixed, colors } from "../../../styles/variables"
import { Square, CheckSquare, Question } from "phosphor-react"
import ReactTooltip from "react-tooltip"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput, StyledLabel, RangeInput, StyledCheckbox, NumberInput } from "../../form/FormComponents"
import AlignmentControls from "./AlignmentControls"
import Icon from "../../Icon"

function HandwritingControls({
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
      <StyledLabel>Dashed line options</StyledLabel>
      <Flexbox
        flexdirection="column"
        flex="flex"
        margin="0 0 1rem"
        border={`1px solid ${colors.gray.nineHundred}`}
        borderradius="0"
      >
        <Flexbox
          alignitems="center"
          flex="flex"
          padding="0.25rem"
        >
          <StyledCheckbox
            onClick={() => handleDashedLineSync()}
            flex="unset"
          >
            <Icon
              margin="0 0.25rem 0 0"
            >
              {dashedLineData.sync ? (
                <CheckSquare size="1rem" color={colors.gray.nineHundred} weight="fill" />
              ) : (
                <Square size="1rem" />
              )}
            </Icon>
            <span>Sync dashed line style</span>
          </StyledCheckbox>
        </Flexbox>
        {!dashedLineData.sync && (
          <>
            <Flexbox
              flex="flex"
            >
              <Flexbox
                flex="flex"
                flexdirection="column"
                margin="0.5rem"
              >
                <StyledLabel>
                  <Flexbox
                    flex="flex"
                    alignitems="center"
                  >
                    <span>Dash / gap size</span>
                    <Icon
                      className="is-help"
                      margin="0 0 0 0.25rem"
                      color={colors.gray.nineHundred}
                      data-tip="A series of number pairs that define dash size and gap size respectively. e.g. '2 6 6 2'"
                    >
                      <Question
                        size="1rem"
                        weight="fill"
                      />
                    </Icon>
                    <ReactTooltip
                      effect="solid"
                      data-multiline={true}
                    />
                  </Flexbox>
                </StyledLabel>
                <StyledInput
                  type="text"
                  value={dashedLineData.dashArray}
                  padding="0.5rem 1.5rem 0.5rem 0.5rem"
                  onChange={e => setDashedLineData({
                    ...dashedLineData,
                    dashArray: e.target.value
                  })}
                />
              </Flexbox>
              <Flexbox
                flex="flex"
                flexdirection="column"
                margin="0.5rem"
              >
                <StyledLabel>Offset</StyledLabel>
                <NumberInput
                  min={0}
                  step={1}
                  value={dashedLineData.dashOffset}
                  padding="0.5rem 1.5rem 0.5rem 0.5rem"
                  onChange={value => setDashedLineData({
                    ...dashedLineData,
                    dashOffset: value,
                  })}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox
              flex="flex"
              flexdirection="column"
              margin="0.5rem"
            >
              <StyledLabel>Opacity</StyledLabel>
              <Flexbox
                flex="flex"
                alignitems="center"
                width="100%"
              >
                <NumberInput
                  value={dashedLineData.opacity}
                  min={0.5}
                  max={1}
                  onChange={value => setDashedLineData({
                    ...dashedLineData,
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
                  value={dashedLineData.opacity}
                  onChange={e => setDashedLineData({
                    ...dashedLineData,
                    opacity: parseFloat(e.target.value),
                  })}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox
              flex="flex"
              flexdirection="column"
              margin="0.5rem"
            >
              <StyledLabel>Thickness</StyledLabel>
              <Flexbox
                flex="flex"
                alignitems="center"
                width="100%"
              >
                <NumberInput
                  value={dashedLineData.thickness}
                  min={0.088}
                  max={3}
                  onChange={value => setDashedLineData({
                    ...dashedLineData,
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
                  value={dashedLineData.thickness}
                  onChange={e => setDashedLineData({
                    ...dashedLineData,
                    thickness: parseFloat(e.target.value)
                  })}
                />
              </Flexbox>
            </Flexbox>
          </>
        )}
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
        >
          <StyledLabel>Line spacing</StyledLabel>
          <NumberInput
            value={pageData.spacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              spacing: value,
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

export default HandwritingControls
