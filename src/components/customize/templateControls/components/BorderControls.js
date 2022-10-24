import React from "react"
import { CheckSquare, Square } from "phosphor-react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel, StyledCheckbox, RangeInput } from "../../../form/FormComponents"
import { BorderOptions, ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"
import Icon from "../../../Icon"

function BorderControls({
  pageData,
  setPageData,
}) {
  const { borderData } = pageData

  function handleBorderSync() {
    if (!borderData.sync) {
      setPageData({
        ...pageData,
        borderData: {
          ...borderData,
          sync: true,
          opacity: 1,
          thickness: 0.088,
        }
      })
    }
    else {
      setPageData({
        ...pageData,
        borderData: {
          ...borderData,
          sync: false,
        }
      })
    }
  }

  return (
    <>
      <StyledLabel>Border options</StyledLabel>
      <ControlFlexWrapper>
        <ControlFlexChild
          flex={1}
          margin="0 8px 0 0"
        >
          <StyledCheckbox
            onClick={() => setPageData({
              ...pageData,
              borderData: {
                ...borderData,
                toggle: !borderData.toggle,
              }
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
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
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
        </ControlFlexChild>
      </ControlFlexWrapper>
      {borderData.toggle && !borderData.sync && (
        <BorderOptions>
          <StyledLabel>Opacity</StyledLabel>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
              margin="0 8px 0 0"
            >
              <NumberInput
                value={borderData.opacity}
                min={0.5}
                max={1}
                onChange={value => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    opacity: value,
                  }
                })}
                padding="0.5rem 1.5rem 0.5rem 0.5rem"
                step={0.01}
                width="4.25rem"
              />
            </ControlFlexChild>
            <ControlFlexChild
              flex={3}
            >
              <RangeInput
                min={0.5}
                step={0.01}
                max={1}
                value={borderData.opacity}
                onChange={e => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    opacity: e.target.value,
                  }
                })}
              />
            </ControlFlexChild>
          </ControlFlexWrapper>
          <StyledLabel>Thickness</StyledLabel>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
              margin="0 8px 0 0"
            >
              <NumberInput
                value={borderData.thickness}
                min={0.088}
                max={3}
                onChange={value => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    thickness: value,
                  }
                })}
                padding="0.5rem 1.5rem 0.5rem 0.5rem"
                step={0.001}
                width="4.25rem"
              />
            </ControlFlexChild>
            <ControlFlexChild
              flex={3}
            >
              <RangeInput
                min="0.088"
                step="0.001"
                max="3"
                value={borderData.thickness}
                onChange={e => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    thickness: parseFloat(e.target.value),
                  }
                })}
              />
            </ControlFlexChild>
          </ControlFlexWrapper>
        </BorderOptions>
      )}
    </>
  )
}

export default BorderControls