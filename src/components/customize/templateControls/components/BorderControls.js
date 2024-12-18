import React from "react"
import { CheckSquare, Square } from "@phosphor-icons/react"
import { colors } from "../../../../styles/variables"

import { NumberInput, StyledLabel, StyledCheckbox, RangeInput } from "../../../form/FormComponents"
import { BorderOptions, ControlFlexWrapper, ControlFlexChild } from "./TemplateComponents"
import Icon from "../../../ui/Icon"

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
          opacity: 100,
          strokeWidth: 0.1,
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
                min={0.3}
                max={1}
                onChange={value => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    opacity: value,
                  }
                })}
                padding="0.5rem 1.5rem 0.5rem 0.5rem"
                step={0.1}
                width="4.25rem"
              />
            </ControlFlexChild>
            <ControlFlexChild
              flex={3}
            >
              <RangeInput
                min={0.3}
                step={0.1}
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
          <StyledLabel>Stroke Width</StyledLabel>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
              margin="0 8px 0 0"
            >
              <NumberInput
                value={borderData.strokeWidth}
                min={0.1}
                max={1}
                onChange={value => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    strokeWidth: value,
                  }
                })}
                padding="0.5rem 1.5rem 0.5rem 0.5rem"
                step={0.05}
                width="4.5rem"
              />
            </ControlFlexChild>
            <ControlFlexChild
              flex={3}
            >
              <RangeInput
                min={0.1}
                step={0.05}
                max={1}
                value={borderData.strokeWidth}
                onChange={e => setPageData({
                  ...pageData,
                  borderData: {
                    ...borderData,
                    strokeWidth: parseFloat(e.target.value),
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