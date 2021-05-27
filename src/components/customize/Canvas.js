import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import PageBackground from "./PageBackground"
import PageSpread from "./PageSpread"
import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const Workspace = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 58px;
  bottom: 6rem;
  right: 300px;
  background-color: ${colors.paper.offWhite};
  overflow: auto;
  align-items: center;
  justify-content: center;
  transition: transform 500ms cubic-bezier(0.13,0.66,0.24,0.92);
  height: 100%;
`

const StyledCanvas = styled.div`
  background-color: ${colors.paper.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

function Canvas({
  activePage,
  canvasSize,
  pageSize,
  setPageSize
}) {

  return (
    <Workspace>
      <StyledCanvas style={{
        width: canvasSize.width,
        height: canvasSize.height
      }}>
        <svg
          id="page-root"
          xlinkns="http://www.w3.org/1999/xlink"
          width={canvasSize.width}
          height={canvasSize.height}
        >
          <PageBackground />
          <PageSpread
            activePage={activePage}
            pageSize={pageSize}
            canvasSize={canvasSize}
          />
        </svg>
      </StyledCanvas>
    </Workspace>
  )
}

export default Canvas
