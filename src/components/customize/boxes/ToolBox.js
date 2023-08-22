import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { Cursor, Pencil, Rectangle, Circle, TextT, LineSegment } from "@phosphor-icons/react"

import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../ui/Icon"

const ToolItem = styled.div`
  padding: 1rem;
  transition: box-shadow 0.2s, background-color 0.2s;
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.primary.hover};
    }
  }
  &.is-active {
    background-color: ${colors.primary.active};
  }
`

function ToolBox() {
  const [selectedTool, setSelectedTool] = useState("cursor")

  const selectTool = e => {
    setSelectedTool(e.currentTarget.dataset.tool)
  }

  return (
    <Flexbox
      flex="flex"
      alignitems="center"
      flexprop="1 1 33%"
    >
      <ToolItem
        data-tool="cursor"
        onClick={e => selectTool(e)}
        className={selectedTool === "cursor" ? "is-active" : null}
      >
        <Icon>
          <Cursor
            size="1.25rem"
            weight={selectedTool === "cursor" ? "fill" : "duotone"}
            color={selectedTool === "cursor" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="pencil"
        onClick={e => selectTool(e)}
        className={selectedTool === "pencil" ? "is-active" : null}
      >
        <Icon>
          <Pencil
            size="1.25rem"
            weight={selectedTool === "pencil" ? "fill" : "duotone"}
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
            size="1.25rem"
            weight={selectedTool === "line" ? "fill" : "duotone"}
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
            size="1.25rem"
            weight={selectedTool === "rectangle" ? "fill" : "duotone"}
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
            size="1.25rem"
            weight={selectedTool === "circle" ? "fill" : "duotone"}
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
            size="1.25rem"
            weight={selectedTool === "text" ? "fill" : "duotone"}
            color={selectedTool === "text" ? colors.gray.nineHundred : colors.gray.sixHundred}
          />
        </Icon>
      </ToolItem>
    </Flexbox>
  )
}

export default ToolBox
