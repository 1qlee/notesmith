import React, { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

const StyledCanvas = styled.div`
  background-color: ${colors.gray.eightHundred};
  position: relative;
  line-height: normal;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  flex-grow: 1;
  height: calc(100% - 35px);
`

const Portal = ({ children }) => {
   const container = document.getElementById("svg-content")

   return createPortal(children, container)
};

function SvgRoot({ children }) {
  return (
    <svg xlinkns="http://www.w3.org/1999/xlink" width="1746" height="940">
      {children}
    </svg>
  )
}

function SvgContent({ page, setSvgDOMRef }) {
  const svgRef = useRef()
  const [svgProperties, setSvgProperties] = useState({
    width: "528",
    height: "816",
    x: "609",
    y: "62"
  })

  useEffect(() => {
    // page.svg is a string - convert it to HTML
    svgRef.current.innerHTML = page.svg
    setSvgDOMRef(svgRef.current)
    // the first child is always the page svg
    const bookWidth = svgRef.current.childNodes[0].childNodes[0].getAttribute('width')
    const bookHeight = svgRef.current.childNodes[0].childNodes[0].getAttribute('height')

    // new state object
    const bookSize = {
      width: bookWidth,
      height: bookHeight,
      x: (1746 - bookWidth) / 2,
      y: (940 - bookHeight) / 2
    }

    setSvgProperties(bookSize)
  }, [page])

  return (
    <svg
      id="svg-content"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      width={svgProperties.width}
      height={svgProperties.height}
      viewBox={`0 0 ${svgProperties.width} ${svgProperties.height}`}
      x={svgProperties.x} y={svgProperties.y}
    >
    </svg>
  )
}

function Canvas({ page, setSvgDOMRef }) {
  return (
    <StyledCanvas>
      <SvgRoot>
        <SvgContent page={page} setSvgDOMRef={setSvgDOMRef} />
      </SvgRoot>
    </StyledCanvas>
  )
}

export { Canvas }
