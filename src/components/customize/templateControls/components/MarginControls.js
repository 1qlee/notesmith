import React from "react"
import styled from "styled-components"
import { ArrowLineUp, ArrowLineDown, ArrowLineRight, ArrowLineLeft } from "phosphor-react"

import { StyledLabel, NumberInput } from "../../../form/FormComponents"
import Icon from "../../../Icon"

const numberInputPadding = "8px 24px"

const MarginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const MarginInput = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  &:not(:last-child) {
    margin-right: 8px;
  }
  .icon {
    position: absolute;
    top: 10px;
    left: 8px;
    z-index: 9;
  }
`

function MarginControls({
  setPageData,
  maximumMarginHeight,
  maximumMarginWidth,
  pageData,
}) {
  return (
    <>
      <StyledLabel>Page margins</StyledLabel>
      <MarginContainer>
        <MarginInput>
          <Icon className="icon">
            <ArrowLineUp size={12} />
          </Icon>
          <NumberInput
            value={pageData.marginTop}
            min={0}
            max={maximumMarginHeight}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginTop: value,
            })}
            padding={numberInputPadding}
            step={1}
          />
        </MarginInput>
        <MarginInput>
          <Icon className="icon">
            <ArrowLineRight size={12} />
          </Icon>
          <NumberInput
            value={pageData.marginRight}
            min={0}
            max={maximumMarginWidth - pageData.marginLeft - 1}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginRight: value,
            })}
            padding={numberInputPadding}
            step={1}
          />
        </MarginInput>
      </MarginContainer>
      <MarginContainer>
        <MarginInput>
          <Icon className="icon">
            <ArrowLineDown size={12} />
          </Icon>
          <NumberInput
            value={pageData.marginBottom}
            min={0}
            max={maximumMarginHeight}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              marginBottom: value,
            })}
            padding={numberInputPadding}
            step={1}
          />
        </MarginInput>
        <MarginInput>
          <Icon className="icon">
            <ArrowLineLeft size={12} />
          </Icon>
          <NumberInput
            value={pageData.marginLeft}
            min={0}
            max={maximumMarginWidth}
            onChange={value => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              marginLeft: value,
            })}
            padding={numberInputPadding}
            step={1}
          />
        </MarginInput>
      </MarginContainer>
    </>
  )
}

export default MarginControls