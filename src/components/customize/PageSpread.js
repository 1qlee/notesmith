import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

function PageSpread({
  selectedPage,
  pageSize,
  canvasSize
}) {
  const [activePage, setActivePage] = useState()
  const canvasPages = JSON.parse(localStorage.getItem("canvas-pages"))
  const pageLeftRef = useRef()
  const pageRightRef = useRef()
  const cover = `<rect width=${pageSize.width} height=${pageSize.height} fill=${colors.primary.sixHundred}></rect>`
  const conversionRatio = canvasSize.height / pageSize.height
  const newPageWidth = pageSize.width * conversionRatio
  const pageSpreadWidth = newPageWidth * 2

  useEffect(() => {
    if (selectedPage == 1) {
      pageLeftRef.current.innerHTML = cover
      pageRightRef.current.innerHTML = canvasPages[0]
    }
    else if (selectedPage == 48) {
      pageLeftRef.current.innerHTML = canvasPages[selectedPage - 1]
      pageRightRef.current.innerHTML = cover
    }
    else {
      pageLeftRef.current.innerHTML = canvasPages[selectedPage - 1]
      pageRightRef.current.innerHTML = canvasPages[selectedPage]
    }
  }, [selectedPage, canvasPages, cover])

  return (
    <svg
      id="page-spread"
      xmlns="http://www.w3.org/2000/svg"
      style={{pointerEvents: "none"}}
      width="100%"
      height={canvasSize.height}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y="0"
    >
      <svg
        ref={pageLeftRef}
        id="page-left"
        width={newPageWidth}
        height={canvasSize.height}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
        x="0"
        y="0"
      ></svg>
      <svg
        ref={pageRightRef}
        id="page-right"
        width={newPageWidth}
        height={canvasSize.height}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={`0 0 ${pageSize.width} ${pageSize.height}`}
        x={newPageWidth}
        y="0"
      ></svg>
    </svg>
  )
}

export default PageSpread
