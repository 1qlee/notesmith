import React from "react"
import { colors } from "../../../../styles/variables"
import { Question, CheckSquare, Square } from "@phosphor-icons/react"
import { Tooltip } from "react-tooltip"

import { NumberInput, StyledLabel, StyledCheckbox, StyledInput, RangeInput } from "../../../form/FormComponents"
import { BorderOptions, ControlFlexWrapper, ControlFlexChild, ControlWrapper } from "./TemplateComponents"
import { Flexbox } from "../../../layout/Flexbox"
import Icon from "../../../ui/Icon"

function DashedLineControls({
  pageData,
  setPageData,
}) {
  const { dashedLineData } = pageData

  function handleDashedLineSync() {
    if (!dashedLineData.sync) {
      setPageData({
        ...pageData,
        dashedLineData: {
          ...dashedLineData,
          sync: true,
          opacity: 1,
          strokeWidth: 0.088,
        }
      })
    }
    else {
      setPageData({
        ...pageData,
        dashedLineData: {
          ...dashedLineData,
          sync: false,
        }
      })
    }
  }

  return (
    <>
      <StyledLabel>Dashed line options</StyledLabel>
      <ControlWrapper>
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
      </ControlWrapper>
      {!dashedLineData.sync && (
        <BorderOptions>
          <ControlWrapper>
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
                <Tooltip
                  effect="solid"
                  data-multiline={true}
                />
              </Flexbox>
            </StyledLabel>
            <StyledInput
              type="text"
              value={dashedLineData.dashArray}
              padding="0.5rem 1.5rem 0.5rem 0.5rem"
              onChange={e => setPageData({
                ...pageData,
                dashedLineData: {
                  ...dashedLineData,
                  dashArray: e.target.value
                }
              })}
            />
          </ControlWrapper>
          <ControlWrapper>
            <StyledLabel>Offset</StyledLabel>
            <NumberInput
              min={0}
              step={1}
              value={dashedLineData.dashOffset}
              padding="0.5rem 1.5rem 0.5rem 0.5rem"
              onChange={value => setPageData({
                ...pageData,
                dashedLineData: {
                  ...dashedLineData,
                  dashOffset: value,
                }
              })}
            />
          </ControlWrapper>
          <StyledLabel>Opacity</StyledLabel>
          <ControlFlexWrapper>
            <ControlFlexChild
              flex={1}
              margin="0 8px 0 0"
            >
              <NumberInput
                value={dashedLineData.opacity}
                min={0.5}
                max={1}
                onChange={value => setPageData({
                  ...pageData,
                  dashedLineData: {
                    ...dashedLineData,
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
                margin="0 0 0 0.5rem"
                width="100%"
                min={0.5}
                step={0.01}
                max={1}
                value={dashedLineData.opacity}
                onChange={e => setPageData({
                  ...pageData,
                  dashedLineData: {
                    ...dashedLineData,
                    opacity: parseFloat(e.target.value),
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
                value={dashedLineData.strokeWidth}
                min={0.088}
                max={3}
                onChange={value => setPageData({
                  ...pageData,
                  dashedLineData: {
                    ...dashedLineData,
                    alignmentHorizontal: "",
                    strokeWidth: value,
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
                margin="0 0 0 0.5rem"
                width="100%"
                min={0.088}
                step={0.001}
                max={3}
                value={dashedLineData.strokeWidth}
                onChange={e => setPageData({
                  ...pageData,
                  dashedLineData: {
                    ...dashedLineData,
                    strokeWidth: parseFloat(e.target.value)
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

export default DashedLineControls