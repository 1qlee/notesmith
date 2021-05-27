import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

function PageBackground() {
  return (
    <svg id="page-background" style={{pointerEvents: "none"}}>
      <rect width="100%" height="100%" x="0" y="0" strokeWidth="0" stroke="transparent" fill={colors.paper.offWhite} style={{pointerEvents: "none"}}></rect>
    </svg>
  )
}

export default PageBackground
