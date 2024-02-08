import React, { useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { Cursor, List, TextT, Rectangle, Circle, LineSegment } from "@phosphor-icons/react"
import { useEditorContext, useEditorDispatch } from "../context/editorContext"

import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../ui/Icon"
import EditorSettingsMenu from "../menus/EditorSettingsMenu"

const ToolItem = styled.div`
  padding: 16px;
  transition: box-shadow 0.2s, background-color 0.2s;
  margin: -1px;
  border: ${colors.borders.black};
  top: 0;
  left: 0;
  z-index: 44;
  background-color: ${colors.white};
  &.is-active {
    background-color: ${colors.gray.nineHundred};
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      background-color: ${colors.gray.oneHundred};
    }
  }
`

const tools = [
  {
    name: "select",
  },
  {
    name: "text"
  }
]

const ToolIcon = ({ name, weight, color }) => {
  switch (name) {
    case "select":
      return (
        <Cursor
          weight={weight}
          color={color}
        />
      )
    case "text":
      return (
        <TextT
          weight={weight}
          color={color}
        />
      )
  }
}

const ToolBox = () => {
  const canvasState = useEditorContext()
  const dispatch = useEditorDispatch()
  const toolRef = useRef(null)
  const showList = canvasState.showSettingsMenu
  console.log(canvasState.tool)

  const handleSelectTool = (tool) => {
    dispatch({
      type: "change-mode",
      mode: tool,
    })
  }

  const handleToggleList = () => {
    dispatch({
      type: "toggle",
      updates: {
        showSettingsMenu: !showList,
      }
    })
    dispatch({
      type: "change-mode",
      mode: "select",
    })
  }

  return (
    <Flexbox
      flex="flex"
      align="center"
    >
      <ToolItem
        id="tool-list"
        onClick={() => handleToggleList()}
        className={showList ? "is-active" : null}
        ref={toolRef}
      >
        <Icon>
          <List
            weight="bold"
            color={showList ? colors.gray.oneHundred : colors.gray.nineHundred}
          />
        </Icon>
      </ToolItem>
      {tools.map((tool) => (
        <ToolItem
          key={tool.name}
          id={`tool-${tool.name}`}
          onClick={() => handleSelectTool(tool.name)}
          className={(canvasState.tool === tool.name && !showList) ? "is-active" : null}
        >
          <Icon>
            <ToolIcon
              name={tool.name}
              weight="bold"
              color={(canvasState.tool === tool.name && !showList) ? colors.gray.oneHundred : colors.gray.nineHundred}
            />
          </Icon>
        </ToolItem>
      ))}
      {showList && (
        <EditorSettingsMenu
          toolRef={toolRef}
        />
      )}
    </Flexbox>
  )
}

export default ToolBox