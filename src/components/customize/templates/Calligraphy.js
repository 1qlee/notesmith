import React, { useState, useEffect } from "react"
import { convertToPx } from "../../../styles/variables"

function Calligraphy({
  maxSvgSize,
  pageData,
  setPageData,
}) {
  const [lineRows, setLineRows] = useState([])
  const [slantRows, setSlantRows] = useState([])
  const { opacity, rows, staffSpacing, thickness, slantAngle, slants } = pageData
  const { height, width } = maxSvgSize
  const ascSpacing = convertToPx(pageData.ascSpacing)
  const dscSpacing = convertToPx(pageData.dscSpacing)
  const xHeight = convertToPx(pageData.xHeight)
  const slantSpacing = convertToPx(pageData.slantSpacing)
  const rowSpacing = convertToPx(staffSpacing)
  const lineThickness = convertToPx(thickness)
  const halfLineThickness = lineThickness / 2
  const rowHeight = ascSpacing + dscSpacing + xHeight + lineThickness * 3

  useEffect(() => {
    function getTan(angle) {
      return Math.tan(angle * Math.PI / 180)
    }

    function createSlants(slantsArray, spaceBtwnRows, row) {
      const maxPosX = width
      const compSlantAngle = 90 - slantAngle

      for (let slant = 0; slant < slants; slant++) {
        const slantOffset = slant * slantSpacing
        let posX1 = slantOffset
        let posX2 = slant * slantSpacing - getTan(compSlantAngle) * rowHeight
        let posY1 = spaceBtwnRows + thickness
        let posY2 = posY1 + rowHeight

        // if the bottom of the lines exceed the maximum X position, restrict num of slants
        // this will cause the loop to exit
        if (posX2 > maxPosX) {
          return slant
        }
        // if the top of the lines exceed the width of the row on its right side
        if (posX1 > maxPosX) {
          const newOffset = maxPosX - posX2
          const newPosY1 = rowHeight - (newOffset * getTan(slantAngle)) + spaceBtwnRows + thickness
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
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: opacity,
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
        const spaceBtwnLines = (line === 0 && row === 0) ? halfLineThickness : lineThickness * line + halfLineThickness
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
          stroke: "#000",
          strokeWidth: lineThickness,
          opacity: opacity,
          x1: posX1,
          x2: posX2,
          y1: posY1,
          y2: posY2,
          row: row,
        }

        // break the loop if we are past the height of the page
        if (posY1 > height) {
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
        const spaceBtwnRows = row * (rowSpacing + rowHeight + lineThickness)

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

    createRows()
  }, [pageData, maxSvgSize])

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