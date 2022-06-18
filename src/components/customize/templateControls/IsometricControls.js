import React from "react"
import { convertToPx, convertToMM, convertFloatFixed, fonts, colors } from "../../../styles/variables"
import { Square, CheckSquare } from "phosphor-react"

import { StyledFieldset, StyledInput, StyledLabel, StyledRange, StyledCheckbox, NumberInput } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"
import Content from "../../Content"
import AlignmentControls from "./AlignmentControls"

function IsometricControls({
  borderData,
  canvasPageSize,
  maximumMarginHeight,
  maximumMarginWidth,
  pageContentSize,
  pageData,
  setBorderData,
  setPageData,
}) {
  const { contentWidth, contentHeight } = pageData
  const pageWidth = convertToMM(pageData.pageWidth)
  const pageHeight = convertToMM(pageData.pageHeight)
  const totalHorizontalMargin = convertFloatFixed(pageWidth - contentWidth, 3)
  const centeredHorizontalMargin = totalHorizontalMargin / 2
  const totalVerticalMargin = convertFloatFixed(pageHeight - contentHeight, 3)
  const centeredVerticalMargin = totalVerticalMargin / 2

  function handleBorderSync() {
    if (!borderData.sync) {
      setBorderData({
        ...borderData,
        sync: true,
        opacity: 1,
        thickness: 0.088,
      })
    }
    else {
      setBorderData({
        ...borderData,
        sync: false,
      })
    }
  }

  function handleMarginLeft(value) {
    if (value + contentWidth > pageWidth) {
      return setPageData({
       ...pageData,
       alignmentHorizontal: "",
       contentWidth: pageWidth - value,
       marginLeft: value,
     })
    }
    else {
      return setPageData({
       ...pageData,
       alignmentHorizontal: "",
       marginLeft: value,
     })
    }
  }

  function handleMarginTop(value) {
    if (value + contentHeight > pageHeight) {
      return setPageData({
       ...pageData,
       alignmentVertical: "",
       contentHeight: pageHeight - value,
       marginTop: value,
     })
    }
    else {
      return setPageData({
       ...pageData,
       alignmentVertical: "",
       marginTop: value,
     })
    }
  }

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
          marginTop: totalVerticalMargin,
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
      <StyledLabel>Border options</StyledLabel>
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
          justifycontent="space-between"
        >
          <StyledCheckbox
            margin="0 0.5rem 0 0"
            onClick={() => setBorderData({
              ...borderData,
              toggle: !borderData.toggle,
            })}
          >
            <Icon
              margin="0 0.25rem 0 0"
            >
              {borderData.toggle ? (
                <CheckSquare size="1rem" color={colors.gray.nineHundred} weight="fill" />
              ) : (
                <Square size="1rem" />
              )}
            </Icon>
            <span>Toggle border</span>
          </StyledCheckbox>
          <StyledCheckbox
            onClick={() => handleBorderSync()}
          >
            <Icon
              margin="0 0.25rem 0 0"
            >
              {borderData.sync ? (
                <CheckSquare size="1rem" color={colors.gray.nineHundred} weight="fill" />
              ) : (
                <Square size="1rem" />
              )}
            </Icon>
            <span>Sync border</span>
          </StyledCheckbox>
        </Flexbox>
        {borderData.toggle && !borderData.sync && (
          <>
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
                  value={borderData.opacity}
                  min={0.5}
                  max={1}
                  onChange={value => setBorderData({
                    ...borderData,
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
                    value={borderData.opacity}
                    onChange={e => setBorderData({
                      ...borderData,
                      opacity: e.target.value,
                    })}
                  />
                </StyledRange>
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
                  value={borderData.thickness}
                  min={0.088}
                  max={3}
                  onChange={value => setBorderData({
                    ...borderData,
                    alignmentHorizontal: "",
                    thickness: value,
                  })}
                  padding="0.5rem 1.5rem 0.5rem 0.5rem"
                  step={0.001}
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
                    value={borderData.thickness}
                    onChange={e => setBorderData({...borderData, thickness: parseFloat(e.target.value)})}
                  />
                </StyledRange>
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
          width="50%"
        >
          <StyledLabel>Angle</StyledLabel>
          <NumberInput
            value={pageData.angle}
            min={1}
            onChange={value => setPageData({
              ...pageData,
              angle: value,
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
          <StyledLabel>Spacing</StyledLabel>
          <NumberInput
            value={pageData.spacing}
            min={1}
            onChange={value => setPageData({
              ...pageData,
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
          <StyledLabel>Width</StyledLabel>
          <NumberInput
            value={pageData.contentWidth}
            min={1}
            max={convertToMM(pageData.pageWidth) - pageData.marginLeft}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              contentWidth: value,
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
          <StyledLabel>Height</StyledLabel>
          <NumberInput
            value={pageData.contentHeight}
            min={1}
            max={convertToMM(pageData.pageHeight) - pageData.marginTop}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              contentHeight: value,
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
            onChange={value => handleMarginTop(value)}
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
            max={convertToMM(pageData.pageWidth - contentWidth)}
            onChange={value => handleMarginLeft(value)}
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
              max={1}
              step={0.01}
              value={pageData.opacity}
              onChange={e => setPageData({
                ...pageData,
                opacity: e.target.value
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
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min={0.088}
              step={0.001}
              max={3}
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

export default IsometricControls
