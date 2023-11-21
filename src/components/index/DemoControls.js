import React from "react"

import { Flexbox } from "../layout/Flexbox"
import { StyledLabel, RangeInput } from "../form/FormComponents"

function DemoInput({
  label,
  min,
  step,
  max,
  value,
  pageData,
  onChangeCb,
  property,
  setPageData,
}) {

  return (
    <Flexbox
      flex="flex"
      align="center"
      margin="0 0 1rem"
      width="100%"
    >
      <StyledLabel
        margin="0"
        htmlFor={`${label}-input`}
        width="144px"
      >
        {label}
      </StyledLabel>
      <RangeInput
        id={`${label}-input`}
        min={parseFloat(min)}
        step={parseFloat(step)}
        max={parseFloat(max)}
        value={parseFloat(value)}
        onChange={e => onChangeCb ? onChangeCb(e.target.value) : setPageData({
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
  const { template } = pageData
  const spacingTemplates = ["ruled", "seyes", "isometric", "music", "handwriting"]
  const rowColSpacingTemplates = ["dot", "graph", "cross"]
  const strokeWidthTemplates = ["ruled", "graph", "hexagon", "seyes", "music", "handwriting", "calligraphy"]
  const showSpacing = spacingTemplates.includes(template)
  const showRolColSpacing = rowColSpacingTemplates.includes(template)
  const showStrokeWidth = strokeWidthTemplates.includes(template)

  return (
    <>
      {template && (
        <>
          {template === "isometric" && (
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
          {template === "dot" && (
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
          {template === "cross" && (
            <DemoInput
              min={1}
              step={1}
              max={20}
              label="Cross size"
              property="crossSize"
              onChangeCb={value => setPageData({
                ...pageData,
                rows: 35,
                columns: 21,
                crossSize: value,
              })}
              value={pageData.crossSize}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {template === "hexagon" && (
            <DemoInput
              min={1}
              step={1}
              max={20}
              label="Hexagon radius"
              property="hexagonRadius"
              onChangeCb={value => setPageData({
                ...pageData,
                hexagonRadius: value,
                rows: 139,
                columns: 139,
              })}
              value={pageData.hexagonRadius}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {template === "calligraphy" && (
            <>
              <DemoInput
                min={30}
                step={1}
                max={60}
                label="Slant angle"
                property="slantAngle"
                onChangeCb={value => setPageData({
                  ...pageData,
                  slantAngle: value,
                  slants: 45,
                })}
                value={pageData.slantAngle}
                pageData={pageData}
                setPageData={setPageData}
              />
            </>
          )}
          {showSpacing && (
            <DemoInput
              min={1}
              step={1}
              max={20}
              label="Spacing"
              property="spacing"
              onChangeCb={value => setPageData({
                ...pageData,
                spacing: value,
                rows: 193,
                columns: 24,
                staves: 18,
              })}
              value={pageData.spacing}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {showRolColSpacing && (
            <>
              <DemoInput
                min={1}
                step={1}
                max={20}
                label="Spacing"
                property="spacing"
                onChangeCb={value => setPageData({
                  ...pageData,
                  rows: 191,
                  columns: 114,
                  rowSpacing: value,
                  columnSpacing: value,
                  spacing: value,
                })}
                value={pageData.spacing}
                pageData={pageData}
                setPageData={setPageData}
              />
            </>
          )}
          {template === "calligraphy" && (
            <DemoInput
              min={0.5}
              step={0.01}
              max={20}
              label="Spacing"
              property="spacing"
              onChangeCb={value => setPageData({
                ...pageData,
                rows: 20,
                slants: 45,
                ascSpacing: value,
                dscSpacing: value,
                xHeight: value,
                spacing: value,
              })}
              value={pageData.spacing}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {showStrokeWidth && (
            <DemoInput
              min={0.088}
              step={0.001}
              max={3}
              label="Stroke width"
              property="strokeWidth"
              value={pageData.strokeWidth}
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
        </>
      )}
    </>
  )
}

export default DemoControls