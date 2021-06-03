import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import PageSpread from "./PageSpread"
import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const Workspace = styled.div`
  background-color: ${colors.paper.offWhite};
  display: flex;
  height: 100%;
  justify-content: center;
  left: 58px;
  overflow: auto;
  position: absolute;
  right: 300px;
  top: 0;
  transition: transform 500ms cubic-bezier(0.13,0.66,0.24,0.92);
  &::-webkit-scrollbar {
    height: 0.5rem;
    width: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.threeHundred};
  }
`

const StyledCanvas = styled.div`
  display: block;
  background-color: ${colors.paper.offWhite};
  position: absolute;
  left: 0;
  top: 0;
`

function Canvas({
  selectedPage,
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
          <PageSpread
            selectedPage={selectedPage}
            pageSize={pageSize}
            canvasSize={canvasSize}
          />
        </svg>
      </StyledCanvas>
    </Workspace>
  )
}

export default Canvas
