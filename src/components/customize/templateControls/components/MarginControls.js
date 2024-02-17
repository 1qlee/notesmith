import React, { useState } from "react"
import styled from "styled-components"
import { ArrowLineUp, ArrowLineDown, ArrowLineRight, ArrowLineLeft, X } from "@phosphor-icons/react"
import { colors } from "../../../../styles/variables"

import { StyledLabel, NumberInput } from "../../../form/FormComponents"
import { ControlInnerButton } from "./TemplateComponents"
import Icon from "../../../ui/Icon"

const MarginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const StyledMarginInput = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 8px;
  }
  .icon {
    position: absolute;
    top: .75rem;
    left: 8px;
    z-index: 9;
  }
`

function MarginInput({ 
  margin,
  pageData, 
  setPageData,
  max,
  alignment,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const numberInputPadding = "8px 44px 8px 24px"

  return (
    <StyledMarginInput
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="icon">
        {margin === "marginTop" &&(
          <ArrowLineUp size={12} />
        )}
        {margin === "marginRight" && (
          <ArrowLineRight size={12} />
        )}
        {margin === "marginBottom" && (
          <ArrowLineDown size={12} />
        )}
        {margin === "marginLeft" && (
          <ArrowLineLeft size={12} />
        )}
      </Icon>
      <NumberInput
        value={pageData[margin]}
        min={0}
        max={max}
        onChange={value => setPageData({
          ...pageData,
          [alignment]: "",
          [margin]: value,
        })}
        padding={numberInputPadding}
        step={1}
      />
      {isHovered && (
        <ControlInnerButton
          color={colors.gray.oneHundred}
          backgroundcolor={colors.gray.nineHundred}
          padding="4px"
          onClick={() => setPageData({
            ...pageData,
            [alignment]: "",
            [margin]: 0,
          })}
        >
          <Icon>
            <X size={12} weight="bold" />
          </Icon>
        </ControlInnerButton>
      )}
    </StyledMarginInput>
  )
}

function MarginControls({
  setPageData,
  maximumMarginHeight,
  maximumMarginWidth,
  pageData,
}) {
  const inputs = [
    {
      margin: "marginTop",
      alignment: "alignmentVertical",
      max: maximumMarginHeight,
    },
    {
      margin: "marginRight",
      alignment: "alignmentHorizontal",
      max: maximumMarginWidth - pageData.marginLeft - 1,
    },
  ]
  const inputstwo = [
    {
      margin: "marginBottom",
      alignment: "alignmentVertical",
      max: maximumMarginHeight,
    },
    {
      margin: "marginLeft",
      alignment: "alignmentHorizontal",
      max: maximumMarginWidth,
    },
  ]

  return (
    <>
      <StyledLabel>Page margins</StyledLabel>
      <MarginContainer>
        {inputs.map(input => (
          <MarginInput
            key={input.margin}
            margin={input.margin}
            pageData={pageData}
            setPageData={setPageData}
            max={input.max}
            alignment={input.alignment}
          />
        ))}
      </MarginContainer>
      <MarginContainer>
        {inputstwo.map(input => (
          <MarginInput
            key={input.margin}
            margin={input.margin}
            pageData={pageData}
            setPageData={setPageData}
            max={input.max}
            alignment={input.alignment}
          />
        ))}
      </MarginContainer>
    </>
  )
}

export default MarginControls