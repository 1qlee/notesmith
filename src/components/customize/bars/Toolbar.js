import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { Cursor, Pencil, Rectangle, Circle, TextT, LineSegment } from "@phosphor-icons/react"

import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../ui/Icon"

const ToolItem = styled.div`
  padding: 14px 16px 13px;
  transition: box-shadow 0.2s, background-color 0.2s;
  margin: -1px;
  border: ${colors.borders.black};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 44;
  background-color: ${colors.white};
  &:not(:last-child) {
    border-bottom: none;
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.gray.oneHundred};
    }
  }
`

function Toolbar() {
  const [selectedTool, setSelectedTool] = useState("cursor")

  const selectTool = e => {
    setSelectedTool(e.currentTarget.dataset.tool)
  }

  return (
    <Flexbox
      flex="flex"
      align="center"
      flexdirection="column"
    >
      <ToolItem
        data-tool="cursor"
        onClick={e => selectTool(e)}
        className={selectedTool === "cursor" ? "is-active" : null}
      >
        <Icon>
          <Cursor
            weight={selectedTool === "cursor" ? "fill" : "regular"}
            color={colors.gray.nineHundred}
          />
        </Icon>
      </ToolItem>
      {/* <ToolItem
        data-tool="pencil"
        onClick={e => selectTool(e)}
        className={selectedTool === "pencil" ? "is-active" : null}
      >
        <Icon>
          <Pencil
            weight={selectedTool === "pencil" ? "fill" : "regular"}
            color={selectedTool === "pencil" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="line"
        onClick={e => selectTool(e)}
        className={selectedTool === "line" ? "is-active" : null}
      >
        <Icon>
          <LineSegment
            weight={selectedTool === "line" ? "fill" : "regular"}
            color={selectedTool === "line" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="rectangle"
        onClick={e => selectTool(e)}
        className={selectedTool === "rectangle" ? "is-active" : null}
      >
        <Icon>
          <Rectangle
            weight={selectedTool === "rectangle" ? "fill" : "regular"}
            color={selectedTool === "rectangle" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="circle"
        onClick={e => selectTool(e)}
        className={selectedTool === "circle" ? "is-active" : null}
      >
        <Icon>
          <Circle
            weight={selectedTool === "circle" ? "fill" : "regular"}
            color={selectedTool === "circle" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="text"
        onClick={e => selectTool(e)}
        className={selectedTool === "text" ? "is-active" : null}
      >
        <Icon>
          <TextT
            weight={selectedTool === "text" ? "fill" : "regular"}
            color={selectedTool === "text" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem> */}
    </Flexbox>
  )
}

export default Toolbar
