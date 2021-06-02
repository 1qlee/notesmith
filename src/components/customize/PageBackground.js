import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

function PageBackground({
  pageSize,
  canvasSize
}) {
  const pageSpreadWidth = pageSize.width * 2

  return (
    <svg
      id="page-background"
      style={{pointerEvents: "none"}}
      width={pageSpreadWidth}
      height={canvasSize.height}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y="0"
    >
      <rect width="100%" height="100%" x="0" y="0" strokeWidth="0" stroke="transparent" fill={colors.paper.offWhite} style={{pointerEvents: "none"}}></rect>
    </svg>
  )
}

export default PageBackground
