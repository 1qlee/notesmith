import React from "react"

import { Flexbox } from "../../layout/Flexbox"
import { RangeInput, StyledLabel, NumberInput} from "../../form/FormComponents"
import AlignmentControls from "./AlignmentControls"

function RuledControls({
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
          <StyledLabel>Lines</StyledLabel>
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
          width="50%"
        >
          <StyledLabel>Spacing</StyledLabel>
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
              opacity: parseFloat(e.target.value),
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
              alignmentVertical: "",
              thickness: parseFloat(e.target.value)
            })}
          />
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default RuledControls
