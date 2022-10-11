import React from "react"

import { ControlFlexWrapper, ControlFlexChild } from "./components/TemplateComponents"
import { Flexbox } from "../../layout/Flexbox"
import { StyledLabel, RangeInput, NumberInput } from "../../form/FormComponents"
import AlignmentControls from "./components/AlignmentControls"
import MarginControls from "./components/MarginControls"
import RowControls from "./components/RowControls"
import ColumnControls from "./components/ColumnControls"
import SpacingControls from "./components/SpacingControls"
import OpacityControls from "./components/OpacityControls"

function DotControls({
  maximumMarginHeight,
  maximumMarginWidth,
  pageData,
  setPageData,
  svgSize,
}) {
  return (
    <>
      <AlignmentControls
        pageData={pageData}
        setPageData={setPageData}
        svgSize={svgSize}
      />
      <MarginControls
        pageData={pageData}
        setPageData={setPageData}
        maximumMarginHeight={maximumMarginHeight}
        maximumMarginWidth={maximumMarginWidth}
      />
      <ControlFlexWrapper>
        <ControlFlexChild
          margin="0 8px 0 0"
          flex={1}
        >
          <RowControls
            pageData={pageData}
            setPageData={setPageData}
          />
        </ControlFlexChild>
        <ControlFlexChild
          flex={1}
        >
          <ColumnControls
            pageData={pageData}
            setPageData={setPageData}
          />
        </ControlFlexChild>
      </ControlFlexWrapper>
      <SpacingControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <OpacityControls
        pageData={pageData}
        setPageData={setPageData}
      />
      <Flexbox
        flex="flex"
        flexdirection="column"
        margin="0 0 1rem 0"
      >
        <StyledLabel>Dot radius</StyledLabel>
        <Flexbox
          flex="flex"
          alignitems="center"
          width="100%"
        >
          <NumberInput
            value={pageData.radius}
            min={0.02}
            max={1}
            onChange={value => setPageData({
              ...pageData,
              alignmentVertical: "",
              alignmentHorizontal: "",
              radius: value,
            })}
            padding="0.5rem 1.5rem 0.5rem 0.5rem"
            step={0.01}
            width="4.25rem"
          />
          <RangeInput
            width="100%"
            margin="0 0 0 0.5rem"
            min={0.02}
            step={0.01}
            max={1}
            value={pageData.radius}
            onChange={e => setPageData({
              ...pageData,
              radius: e.target.value,
              alignmentVertical: "",
              alignmentHorizontal: "",
            })}
          />
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default DotControls
