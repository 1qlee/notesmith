import React from "react"
import { convertToPx, convertToMM } from "../../../styles/variables"

import { StyledFieldset, StyledInput, StyledLabel, StyledRange } from "../../form/FormComponents"
import { Flexbox } from "../../layout/Flexbox"
import AlignmentControls from "./AlignmentControls"

function RuledControls({ pageData, setPageData, pageSize }) {
  const lineWidth = pageData.pageWidth - convertToPx(pageData.marginLeft) - convertToPx(pageData.marginRight)
  const horizontalMargin = (pageData.pageWidth - lineWidth) / 2
  const lineHeight = convertToPx((pageData.rows - 1) * pageData.spacing)
  const verticalMargin = (pageData.pageHeight - lineHeight) / 2
  const bottomMargin = pageData.pageHeight - lineHeight - convertToPx(3.175) - 1

  function changeAlignment(value) {
    switch(value) {
      case "left":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: 3.175,
          marginRight: convertToMM(pageData.pageWidth - lineWidth - convertToPx(3.175)),
        })
        break
      case "right":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginRight: 3.175,
          marginLeft: convertToMM(pageData.pageWidth - lineWidth - convertToPx(3.175)),
        })
        break
      case "center":
        setPageData({
          ...pageData,
          alignmentHorizontal: value,
          marginLeft: convertToMM(horizontalMargin),
          marginRight: convertToMM(horizontalMargin),
        })
        break
      case "top":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: 3.175,
        })
        break
      case "middle":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertToMM(verticalMargin),
        })
        break
      case "bottom":
        setPageData({
          ...pageData,
          alignmentVertical: value,
          marginTop: convertToMM(bottomMargin),
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
          <StyledLabel>Rows</StyledLabel>
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={pageData.rows}
            padding="0.5rem"
            width="100%"
            onChange={e => setPageData({
              ...pageData,
              alignmentVertical: "",
              rows: e.target.value,
            })}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
          width="33%"
        >
          <StyledLabel>Columns</StyledLabel>
          <StyledInput
            type="number"
            min="1"
            step="1"
            value={pageData.columns}
            padding="0.5rem"
            width="100%"
            onChange={e => setPageData({
              ...pageData,
              alignmentHorizontal: "",
              columns: e.target.value,
            })}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
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
            onChange={e => setPageData({
              ...pageData,
              alignmentVertical: "",
              spacing: e.target.value
            })}
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
            type="number"
            min="0"
            step="1"
            padding="0.5rem"
            width="100%"
            value={pageData.marginTop}
            onChange={e => setPageData({...pageData, alignmentVertical: "", marginTop: e.target.value})}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Left margin</StyledLabel>
          <StyledInput
            type="number"
            step="1"
            padding="0.5rem"
            width="100%"
            value={pageData.marginLeft}
            onChange={e => setPageData({...pageData, alignmentHorizontal: "", marginLeft: e.target.value})}
          />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          margin="0 0.5rem 0 0"
        >
          <StyledLabel>Right margin</StyledLabel>
          <StyledInput
            type="number"
            step="1"
            padding="0.5rem"
            width="100%"
            value={pageData.marginRight}
            onChange={e => setPageData({...pageData, alignmentHorizontal: "", marginRight: e.target.value})}
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
            onChange={e => setPageData({...pageData, opacity: e.target.value})}
            type="number"
            min="0.2"
            step="0.1"
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
              min="0.2"
              step="0.1"
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
            onChange={e => setPageData({...pageData, thickness: e.target.value})}
            type="number"
            min="0.3"
            step="0.1"
            max="5"
            padding="0.5rem"
            width="4rem"
          />
          <StyledRange
            margin="0 0 0 0.5rem"
            width="100%"
          >
            <input
              type="range"
              min="0.3"
              step="0.1"
              max="5"
              value={pageData.thickness}
              onChange={e => setPageData({...pageData, thickness: e.target.value})}
            />
          </StyledRange>
        </Flexbox>
      </Flexbox>
    </>
  )
}

export default RuledControls
