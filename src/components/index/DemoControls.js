import React, { useState, useEffect } from "react"

import { Flexbox } from "../layout/Flexbox"
import { StyledLabel, RangeInput } from "../form/FormComponents"

function DemoInput({
  label,
  min,
  step,
  max,
  value,
  pageData,
  property,
  setPageData,
}) {
  return (
    <Flexbox
      flex="flex"
      alignitems="center"
      margin="0 0 1rem"
      width="100%"
    >
      <StyledLabel
        margin="0"
        htmlFor={`${label}-input`}
        width="112px"
      >
        {label}
      </StyledLabel>
      <RangeInput
        id={`${label}-input`}
        min={parseFloat(min)}
        step={parseFloat(step)}
        max={parseFloat(max)}
        value={parseFloat(value)}
        onChange={e => setPageData({
          ...pageData,
          [property]: parseFloat(e.target.value),
        })}
        width="100%"
      />
    </Flexbox>
  )
}

function DemoControls({
  pageData,
  setPageData,
}) {
  const [maxRows, setMaxRows] = useState(52)
  const [maxCols, setMaxCols] = useState(30)
  const [minSpacing, setMinSpacing] = useState(3)
  const rowsTemplates = ["ruled", "dot", "graph", "hexagon", "seyes", "music", "cross"]
  const colsTemplates = ["dot", "graph", "hexagon", "seyes", "cross"]
  const thicknessTemplates = ["ruled", "graph", "hexagon", "seyes", "music", "handwriting", "calligraphy"]
  const showRows = rowsTemplates.includes(pageData.template)
  const showCols = colsTemplates.includes(pageData.template)
  const showThickness = thicknessTemplates.includes(pageData.template)

  useEffect(() => {
    switch(pageData.template) {
      case "dot":
        setMaxRows(52)
        setMaxCols(30)
        setMinSpacing(3)
        break
      case "graph":
        setMaxRows(50)
        setMaxCols(30)
        setMinSpacing(3)
        break
      case "hexagon":
        setMaxRows(39)
        setMaxCols(21)
        setMinSpacing(3)
        break
      case "seyes":
        setMaxRows(70)
        setMaxCols(9)
        setMinSpacing(2)
        break
      case "music":
        setMaxRows(70)
        setMaxCols(9)
        setMinSpacing(2)
        break
    }
  })

  return (
    <>
      {pageData.template && (
        <>
          {showRows && (
            <DemoInput
              min={1}
              step={1}
              max={maxRows}
              label="Rows"
              property="rows"
              value={pageData.rows}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {showCols && (
            <DemoInput
              min={1}
              step={1}
              max={maxCols}
              label="Columns"
              property="columns"
              value={pageData.columns}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {showThickness && (
            <DemoInput
              min={0.088}
              step={0.001}
              max={3}
              label="Thickness"
              property="thickness"
              value={pageData.thickness}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "isometric" && (
            <DemoInput
              min={1}
              step={1}
              max={89}
              label="Angle"
              property="angle"
              value={pageData.angle}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "dot" && (
            <DemoInput
              min={0.02}
              step={0.01}
              max={1}
              label="Dot radius"
              property="radius"
              value={pageData.radius}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "cross" && (
            <DemoInput
              min={0.5}
              step={0.01}
              max={20}
              label="Cross size"
              property="size"
              value={pageData.size}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "music" && (
            <DemoInput
              min={0.5}
              step={0.01}
              max={20}
              label="Staff spacing"
              property="groupSpacing"
              value={pageData.groupSpacing}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          <DemoInput
            min={0.5}
            step={0.1}
            max={1}
            label="Opacity"
            property="opacity"
            value={pageData.opacity}
            pageData={pageData}
            setPageData={setPageData}
          />
          <DemoInput
            min={minSpacing}
            step={1}
            max={20}
            label="Spacing"
            property="spacing"
            value={pageData.spacing}
            pageData={pageData}
            setPageData={setPageData}
          />
        </>
      )}
    </>
  )
}

export default DemoControls