import React, { useState, useRef } from "react"
import { convertToPx, convertToMM, convertFloatFixed, fonts, colors } from "../../../styles/variables"
import { Square, CheckSquare } from "phosphor-react"
import { validateInput, validateOnBlur, validateOnKeydown, validateMinValue } from "./template-functions"

import { StyledFieldset, StyledInput, StyledLabel, StyledRange, StyledCheckbox } from "../../form/FormComponents"
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
  const marginTopInput = useRef(null)
  const marginLeftInput = useRef(null)

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

  function changeAlignment(value) {
    for (let line = 0; line < pageData.pageWidth; line++) {

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
        border={`1px solid ${colors.gray.threeHundred}`}
        borderradius="0.25rem"
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
                <CheckSquare size="1rem" color={colors.primary.sixHundred} weight="fill" />
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
                <CheckSquare size="1rem" color={colors.primary.sixHundred} weight="fill" />
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
                <StyledInput
                  value={borderData.opacity}
                  onChange={e => validateMinValue(e.target.value, 0.5, value => setBorderData({
                    ...borderData,
                    opacity: value,
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
                    value={borderData.opacity}
                    onChange={e => setBorderData({...borderData, opacity: e.target.value})}
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
                  value={borderData.thickness}
                  onChange={e => validateMinValue(e.target.value, 0.088, value => setBorderData({...borderData, thickness: value}), 3)}
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
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={pageData.angle}
            padding="0.5rem"
            width="100%"
            onChange={e => validateMinValue(e.target.value, 1, value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              angle: value,
            }))}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          width="50%"
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
              alignmentHorizontal: "",
              spacing: value
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
              marginTop: value
            }), maximumMarginHeight)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginTop: value
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
            onChange={e => validateMinValue(e.target.value, 0, value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginLeft: value,
            }), maximumMarginWidth - pageData.marginRight - 1)}
            onBlur={e => validateOnBlur(e, 0, value => setPageData({
              ...pageData,
              marginLeft: value,
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
              opacity: value,
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
              onChange={e => setPageData({...pageData, opacity: e.target.value})}
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
            onChange={e => validateMinValue(e.target.value, 0.088, value => setPageData({...pageData, thickness: value}), 3)}
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
              onChange={e => setPageData({...pageData, thickness: parseFloat(e.target.value)})}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default IsometricControls
