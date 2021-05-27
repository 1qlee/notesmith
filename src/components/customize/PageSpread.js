import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

function PageSpread({
  activePage,
  pageSize,
  canvasSize
}) {
  const canvasPages = JSON.parse(localStorage.getItem("canvas-pages"))
  const pageLeftRef = useRef()
  const pageRightRef = useRef()

  useEffect(() => {
    if (activePage == 1) {
      pageRightRef.current.innerHTML = canvasPages[0]
    }
  })

  return (
    <svg id="page-spread" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: "none"}}>
      <svg
        ref={pageLeftRef}
        id="page-left"
        width={pageSize.width}
        height={canvasSize.height}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
      ></svg>
      <svg
        ref={pageRightRef}
        id="page-right"
        width={pageSize.width}
        height={canvasSize.height}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
      >

      </svg>
    </svg>
  )
}

export default PageSpread
