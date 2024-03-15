import React, { useState, useEffect } from "react"
import { convertToPx } from "../../../utils/helper-functions"

function Calligraphy({
  maxSvgSize,
  pageData,
  setPageData,
  setMax,
  setSvgLoaded,
}) {
  const [lineRows, setLineRows] = useState([])
  const [slantRows, setSlantRows] = useState([])
  const { opacity, rows, strokeWidth, slantAngle, slants } = pageData
  const { height, width } = maxSvgSize
  const ascSpacing = convertToPx(pageData.ascSpacing)
  const dscSpacing = convertToPx(pageData.dscSpacing)
  const xHeight = convertToPx(pageData.xHeight)
  const slantSpacing = convertToPx(pageData.slantSpacing)
  const rowSpacing = convertToPx(pageData.rowSpacing)
  const lineStrokeWidth = convertToPx(strokeWidth)
  const halfLineStrokeWidth = lineStrokeWidth / 2
  const rowHeight = ascSpacing + dscSpacing + xHeight + lineStrokeWidth * 3
  const maxSlants = 137
  const maxRows = Math.floor((height + rowSpacing) / (rowHeight + rowSpacing))

  function getTan(angle) {
    return Math.tan(angle * Math.PI / 180)
  }

  function createSlants(slantsArray, spaceBtwnRows, row) {
    const maxPosX = width
    const compSlantAngle = 90 - slantAngle

    for (let slant = 0; slant < slants; slant++) {
      const slantOffset = slant * (slantSpacing + lineStrokeWidth)
      let posX1 = slantOffset
      let posX2 = slant * (slantSpacing + lineStrokeWidth) - getTan(compSlantAngle) * rowHeight
      let posY1 = spaceBtwnRows + halfLineStrokeWidth
      let posY2 = posY1 + rowHeight

      // if the bottom of the lines exceed the maximum X position, restrict num of slants
      // this will cause the loop to exit
      if (posX2 > maxPosX) {
        return slant
      }
      // if the top of the lines exceed the width of the row on its right side
      if (posX1 > maxPosX) {
        const newOffset = maxPosX - posX2
        const newPosY1 = rowHeight - (newOffset * getTan(slantAngle)) + spaceBtwnRows + strokeWidth
        posX1 = maxPosX
        posY1 = newPosY1
      }
      // if the bottom of the lines exceed the width of the row on its right side
      if (posX2 > maxPosX) {
        const newAngle = 180 - slantAngle
        const newOffset = width - slantOffset
        const newPosY2 = newOffset * getTan(newAngle)
        posX2 = width
        posY2 = newPosY2 + posY1
      }
      // if the bottom of the lines exceed the width of the row on its left side
      if (posX2 < 0) {
        const newPosY2 = slantOffset * getTan(slantAngle)
        posX2 = 0
        posY2 = newPosY2 + posY1
      }

      const slantProps = {
        stroke: "#000000",
        strokeWidth: lineStrokeWidth,
        opacity: opacity / 100,
        x1: posX1,
        x2: posX2,
        y1: posY1,
        y2: posY2,
        row: row,
      }

      slantsArray.push(slantProps)
    }
  }

  function createLines(linesArray, spaceBtwnRows, row) {
    for (let line = 0; line < 4; line++) {
      const spaceBtwnLines = (line === 0 && row === 0) ? halfLineStrokeWidth : lineStrokeWidth * line + halfLineStrokeWidth
      const offset = spaceBtwnRows + spaceBtwnLines
      const posX1 = 0
      const posX2 = width
      let posY1 = offset

      if (line === 1) {
        posY1 += ascSpacing
      }
      else if (line === 2) {
        posY1 += ascSpacing + xHeight
      }
      else if (line === 3) {
        posY1 += ascSpacing + xHeight + dscSpacing
      }

      const posY2 = posY1
      const lineProps = {
        stroke: "#000000",
        strokeWidth: lineStrokeWidth,
        opacity: opacity / 100,
        x1: posX1,
        x2: posX2,
        y1: posY1,
        y2: posY2,
        row: row,
      }

      // break the loop if we are past the height of the page
      if (posY1 + halfLineStrokeWidth > height) {
        return row
      }
      else {
        linesArray.push(lineProps)
      }
    }
  }

  function createRows() {
    const dummyLinesArray = []
    const dummySlantsArray = []

    for (let row = 0; row < rows; row++) {
      const spaceBtwnRows = row * (rowSpacing + rowHeight + lineStrokeWidth)

      const slants = createSlants(dummySlantsArray, spaceBtwnRows, row)
      const lines = createLines(dummyLinesArray, spaceBtwnRows, row)

      if (slants) {
        return setPageData({
          ...pageData,
          slants: slants
        })
      }
      if (lines) {
        return setPageData({
          ...pageData,
          rows: lines
        })
      }
    }

    setLineRows(dummyLinesArray)
    setSlantRows(dummySlantsArray)
  }

  useEffect(() => {
    createRows()
    setMax({
      rows: maxRows,
      slants: maxSlants,
    })
    setSvgLoaded(Math.random(1))
  }, [pageData])

  return (
    <>
      {lineRows.map((line, index) => (
        <line
          key={`${line.row}-${index}`}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          opacity={line.opacity}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        />
      ))}
      {slantRows.map((slant, index) => (
        <line
          key={`${slant.row}-${index}`}
          stroke={slant.stroke}
          strokeWidth={slant.strokeWidth}
          opacity={slant.opacity}
          x1={slant.x1}
          x2={slant.x2}
          y1={slant.y1}
          y2={slant.y2}
        />
      ))}
    </>
  )
}

export default Calligraphy
