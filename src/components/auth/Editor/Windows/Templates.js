import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { colors } from "../../../../styles/variables"
import { useFirebaseContext } from "../../../../utils/auth"

import Window from "./Window"

const Portal = ({ children }) => {
   const container = document.getElementById("svg-content")

   return createPortal(children, container)
};

function LinedPage({ svgDOMRef, pageOptions }) {
  const width = svgDOMRef.getAttribute("width")
  const height = svgDOMRef.getAttribute("height")
  const heightPixels = height * .264583
  const numOfLines = heightPixels / pageOptions.spacing
  const linesArray = []

  for (let i = 0; i < numOfLines; i++) {
    const line = {
      fill: "none",
      stroke: "#000",
      strokeWidth: pageOptions.thickness,
      x1: "0",
      x2: width,
      y1: (i * 5) / .264583,
      y2: (i * 5) / .264583
    }

    linesArray.push(line)
  }

  return (
    <g>
      {linesArray.map(line => (
        <line
          fill={line.fill}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
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

function Templates({ page, svgDOMRef }) {
  const [pageOptions, setPageOptions] = useState({
    opacity: 0.3,
    thickness: 1,
    spacing: 5
  })
  const [showPage, setShowPage] = useState({
    show: false,
    type: "lined"
  })

  function createPage(e) {
    e.preventDefault()
    setShowPage({
      show: true,
      type: "lined"
    })
  }

  return (
    <Window>
      {showPage.show && (
        <Portal>
          <LinedPage svgDOMRef={svgDOMRef} pageOptions={pageOptions}/>
        </Portal>
      )}
      <form id="templates-window-form">
        <button onClick={e => createPage(e)}>Submit</button>
        <fieldset>
          <label>Opacity</label>
          <input
            type="range"
            min="0.2"
            step="0.1"
            max="1"
            value={pageOptions.opacity}
            onChange={e => setPageOptions({...pageOptions, opacity: e.target.value})}
          />
          <p style={{color: 'cyan'}}>{pageOptions.opacity}</p>
        </fieldset>
        <fieldset>
          <label>Thickness</label>
          <input
            type="number"
            min="0.2"
            step="0.1"
            value={pageOptions.thickness}
            onChange={e => setPageOptions({...pageOptions, thickness: e.target.value})}
          />
          <p style={{color: 'cyan'}}>{pageOptions.thickness}</p>
        </fieldset>
        <fieldset>
          <label>Spacing</label>
          <input
            type="number"
            min="1"
            step="1"
            value={pageOptions.spacing}
            onChange={e => setPageOptions({...pageOptions, spacing: e.target.value})}
          />
          <p style={{color: 'cyan'}}>{pageOptions.spacing}</p>
        </fieldset>
      </form>
    </Window>
  )
}

export default Templates
