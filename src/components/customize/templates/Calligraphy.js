import React, { useState, useEffect } from "react"
import { convertToPx, convertToMM, convertFloatFixed } from "../../../styles/variables"

function Calligraphy({
  dashedLineData,
  pageData,
  setPageData,
}) {
  const [writingRows, setWritingRows] = useState([])
  const [slantRows, setSlantRows] = useState([])
  const { pageWidth, pageHeight, opacity, rows, spacing, groupSpacing, thickness, slantAngle, slants } = pageData
  const ascSpacing = convertToPx(pageData.ascSpacing)
  const dscSpacing = convertToPx(pageData.dscSpacing)
  const xHeight = convertToPx(pageData.xHeight)
  const slantSpacing = convertToPx(pageData.slantSpacing)
  const dashOffset = convertToPx(dashedLineData.dashOffset)
  const lineSpacing = convertToPx(spacing)
  const rowSpacing = convertToPx(groupSpacing)
  const lineThickness = convertToPx(thickness)
  const halfLineThickness = lineThickness / 2
  const marginTop = convertToPx(pageData.marginTop)
  const marginLeft = convertToPx(pageData.marginLeft)
  const marginRight = convertToPx(pageData.marginRight)

  function parseDashArray(value) {
    if (value.length > 0) {
      let dummyArray = []
      // create an array from the dash array prop by splitting btwn spaces
      let newDashArray = value.split(" ")
      newDashArray.map(elem => {
        dummyArray.push(convertToPx(parseFloat(elem)))
      })

      console.log(dummyArray)
      return dummyArray
    }
  }

  useEffect(() => {
    function getTan(angle) {
      return Math.tan(angle * Math.PI / 180)
    }

    function createWritingRows() {
      const rowsArray = []
      const slantRowsArray = []
      const dashArray = parseDashArray(dashedLineData.dashArray)

      for (let row = 0; row < rows; row++) {
        const linesArray = []
        const slantsArray = []
        const rowHeight = ascSpacing + dscSpacing + xHeight + lineThickness * 3
        const spaceBtwnRows = row * (rowSpacing + rowHeight + lineThickness)
        const rowWidth = pageWidth - marginLeft - marginRight

        for (let slant = 0; slant < slants; slant++) {
          const posX1 = marginLeft + slant * slantSpacing
          const posX2 = slant * slantSpacing - getTan(90 - slantAngle) * rowHeight + marginLeft
          const posY1 = marginTop + spaceBtwnRows
          const posY2 = posY1 + rowHeight

          const slantProps = {
            stroke: "#000",
            strokeWidth: lineThickness,
            opacity: opacity,
            x1: posX1,
            x2: posX2,
            y1: posY1,
            y2: posY2,
          }

          if (posX1 > pageWidth) {
            break
          }
          else {
            slantsArray.push(slantProps)
          }
        }

        for (let line = 0; line < 4; line++) {
          const spaceBtwnLines = (line === 0 && row === 0) ? halfLineThickness : lineThickness * line + halfLineThickness
          const offset = spaceBtwnRows + spaceBtwnLines
          const posX1 = marginLeft
          const posX2 = pageWidth - marginRight
          let posY1 = marginTop + offset

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
          }

          // break the loop if we are past the height of the page
          if (posY1 > pageHeight) {
            setPageData({
              ...pageData,
              rows: row,
            })
            break
          }
          else {
            linesArray.push(lineProps)
          }
        }

        rowsArray.push(linesArray)
        slantRowsArray.push(slantsArray)
      }

      setWritingRows(rowsArray)
      setSlantRows(slantRowsArray)
    }

    createWritingRows()
  }, [pageData, dashedLineData])

  return (
    <>
      {writingRows.map((row, index) => (
        <>
          <g key={`row-${index}`}>
            {row.map((line, index) => (
              <line
                key={index}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                strokeDasharray={line.strokeDasharray ? line.strokeDasharray : null}
                strokeDashoffset={line.strokeDashoffset ? line.strokeDashoffset : null}
                opacity={line.opacity}
                x1={line.x1}
                x2={line.x2}
                y1={line.y1}
                y2={line.y2}
              />
            ))}
          </g>
          {slantRows.map((slantRow, index) => (
            <g key={`slant-${index}`}>
              {slantRow.map((slant, index) => (
                <line
                  key={index}
                  stroke={slant.stroke}
                  strokeWidth={slant.strokeWidth}
                  strokeDasharray={slant.strokeDasharray ? slant.strokeDasharray : null}
                  strokeDashoffset={slant.strokeDashoffset ? slant.strokeDashoffset : null}
                  opacity={slant.opacity}
                  x1={slant.x1}
                  x2={slant.x2}
                  y1={slant.y1}
                  y2={slant.y2}
                />
              ))}
            </g>
          ))}
        </>
      ))}
    </>
  )
}

export default Calligraphy
