import React, { useRef } from "react"
import { svgToObjects, createAttributes } from "../utils/helper-functions"

function Test() {


  function applyTemplate() {
    const shitter = svgToObjects(svgNode.current, 0)
    console.log(shitter)

  }

  const svgNode = useRef(null)

  return (
    <>
      <svg ref={svgNode} xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5"></circle>
        <circle cx="15" cy="25"></circle>
        <g>
          <circle cx="35" cy="45"></circle>
          <circle cx="11" cy="12"></circle>
          <g>
            <rect x="4" y="7"></rect>
            <circle cx="2" cy="3"></circle>
          </g>
          <g>
            <rect x="55" y="25"></rect>
            <circle cx="65" cy="45"></circle>
          </g>
          <circle cx="125" cy="44"></circle>
          <rect x="58" y="52"></rect>
        </g>
        <circle cx="5" cy="5"></circle>
        <circle cx="15" cy="25"></circle>
      </svg>
      <button onClick={() => applyTemplate()}>Generate</button>
    </>
  )
}

export default Test
