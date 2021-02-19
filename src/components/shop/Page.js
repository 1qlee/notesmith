import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { colors, convertToPx } from "../../styles/variables"

function PageSvg({ children, pageData, bookData }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        boxShadow: `0 2px 8px ${colors.shadow.float}`
      }}
      viewBox={`0 0 ${bookData.width} ${bookData.height}`}
      width={bookData.width}
      height={bookData.height}
      x="0"
      y="0"
    >
      <g>
        <rect x='-1' y='-1' width={bookData.width} height={bookData.height} fill='#fff'></rect>
      </g>
      {children}
    </svg>
  )
}

function Lined({ pageData, bookData }) {
  const lines = []

  if (pageData.marginTop < 3.175) {
    pageData.marginTop = 3.175
  }

  for (let i = 0; i < pageData.rows; i++) {
    const linePos = {
      x: convertToPx(pageData.marginLeft),
      y: (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop)
    }

    const line = {
      fill: "none",
      stroke: "#000",
      strokeWidth: pageData.thickness,
      opacity: pageData.opacity,
      x1: linePos.x,
      x2: bookData.width + linePos.x,
      y1: linePos.y,
      y2: linePos.y
    }

    // loop will exit if the line have passed the height of the page
    if (linePos.y > bookData.height - convertToPx(3.175)) {
      // change the number of rows displayed
      pageData.rows = i
      break
    }
    else {
      lines.push(line)
    }
  }

  return (
    <g>
      {lines.map((line, index) => (
        <line
          key={index}
          fill={line.fill}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          style={{opacity: `${line.opacity}`}}
          x1={line.x1}
          x2={line.x2}
          y1={line.y1}
          y2={line.y2}
        >
        </line>
      ))}
    </g>
  )
}

function Dots({ pageData, bookData }) {
  const dots = []

  if (pageData.marginLeft < 3.175) {
    pageData.marginLeft = 3.175
  }
  if (pageData.marginTop < 3.175) {
    pageData.marginTop = 3.175
  }

  // loop to create rows of dots
  for (let i = 0; i < pageData.rows; i++) {
    // we will store rows of dots in this array
    const dotRow = []

    // loop to create each individual dot (aka columns) in a row
    for (let ii = 0; ii < pageData.columns; ii++) {
      const dotPos = {
        x: (ii * convertToPx(pageData.spacing)) + convertToPx(pageData.marginLeft),
        y: (i * convertToPx(pageData.spacing)) + convertToPx(pageData.marginTop)
      }
      const dot = {
        fill: "#000",
        radius: pageData.thickness,
        opacity: pageData.opacity,
        cx: dotPos.x,
        cy: dotPos.y
      }

      // loop will exit if the dots have passed the height of the page
      if (dotPos.y > bookData.height - convertToPx(3.175)) {
        // this essentially caps the number of total rows at the "exceeding" value
        pageData.rows = i
        break
      }
      // loop will exit if the dots have passed the width of the page
      else if (dotPos.x > bookData.width - convertToPx(3.175)) {
        // this essentially caps the number of dots in a row at the "exceeding" value
        pageData.columns = ii
        break
      }
      else {
        dotRow.push(dot)
      }
    }

    dots.push(dotRow)
  }

  return (
    <g>
      {dots.map((dotRow, index) => (
        <g key={index}>
          {dotRow.map((dot, index) => (
            <circle
              key={index}
              fill={dot.fill}
              r={dot.radius}
              style={{opacity: `${dot.opacity}`}}
              cx={dot.cx}
              cy={dot.cy}
            >
            </circle>
          ))}
        </g>
      ))}
    </g>
  )
}

const Page = ({ pageData, bookData }) => {
  return (
    <PageSvg
      pageData={pageData}
      bookData={bookData}
    >
      {pageData.type === "Lined" && (
        <Lined
          pageData={pageData}
          bookData={bookData}
         />
      )}
      {pageData.type === "Dots" && (
        <Dots
          pageData={pageData}
          bookData={bookData}
         />
      )}
    </PageSvg>
  )
}

export default Page
