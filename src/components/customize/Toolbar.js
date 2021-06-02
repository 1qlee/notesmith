import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { Cursor, Pencil, Rectangle, Circle, TextT } from "phosphor-react"
import Line from "../../assets/customize/line.svg"

import Icon from "../Icon"
import Button from "../Button"

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  box-shadow: 0 2px 2px ${colors.shadow.float};
  background-color: ${colors.white};
  height: 354px;
`

const ToolItem = styled.div`
  padding: 1rem;
  &.is-active {
    background-color: ${colors.primary.active};
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.primary.hover};
    }
  }
`

function Toolbar({ children }) {
  const [selectedTool, setSelectedTool] = useState("cursor")

  const selectTool = e => {
    setSelectedTool(e.currentTarget.dataset.tool)
  }

  return (
    <StyledToolbar>
      <ToolItem
        data-tool="cursor"
        onClick={e => selectTool(e)}
        className={selectedTool === "cursor" ? "is-active" : null}
      >
        <Icon>
          <Cursor size="1.5rem" weight="duotone" color={selectedTool === "cursor" ? colors.gray.nineHundred : colors.gray.sixHundred} />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="pencil"
        onClick={e => selectTool(e)}
        className={selectedTool === "pencil" ? "is-active" : null}
      >
        <Icon>
          <Pencil size="1.5rem" weight="duotone" color={selectedTool === "pencil" ? colors.gray.nineHundred : colors.gray.sixHundred} />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="line"
        onClick={e => selectTool(e)}
        className={selectedTool === "line" ? "is-active" : null}
      >
        <Icon>
          <Line width="1.5rem" height="1.5rem" style={selectedTool === "line" ? {stroke: colors.gray.nineHundred} : {stroke: colors.gray.sixHundred}} />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="rectangle"
        onClick={e => selectTool(e)}
        className={selectedTool === "rectangle" ? "is-active" : null}
      >
        <Icon>
          <Rectangle size="1.5rem" weight="duotone" color={selectedTool === "rectangle" ? colors.gray.nineHundred : colors.gray.sixHundred} />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="circle"
        onClick={e => selectTool(e)}
        className={selectedTool === "circle" ? "is-active" : null}
      >
        <Icon>
          <Circle size="1.5rem" weight="duotone" color={selectedTool === "circle" ? colors.gray.nineHundred : colors.gray.sixHundred} />
        </Icon>
      </ToolItem>
      <ToolItem
        data-tool="text"
        onClick={e => selectTool(e)}
        className={selectedTool === "text" ? "is-active" : null}
      >
        <Icon>
          <TextT size="1.5rem" weight="duotone" color={selectedTool === "text" ? colors.gray.nineHundred : colors.gray.sixHundred} />
        </Icon>
      </ToolItem>
    </StyledToolbar>
  )
}

export default Toolbar
