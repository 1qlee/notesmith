import React, { useEffect, useState, useRef } from "react"
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
    name: "list",
  },
  {
    name: "select",
  },
  {
    name: "text"
  }
]

const ToolIcon = ({ name, weight, color }) => {
  switch (name) {
    case "list":
      return (
        <List
          weight={weight}
          color={color}
        />
      )
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
  const [selectedTool, setSelectedTool] = useState("select")
  const toolRef = useRef(null)

  useEffect(() => {
    if (!selectedTool) {
      setSelectedTool("select")

      dispatch({
        type: "change-mode",
        mode: "select",
      })
    }
  }, [selectedTool])

  const handleSelectTool = (tool) => { 
    if (tool === "list" || !tool) {
      dispatch({
        type: "change-mode",
        mode: "select",
      })
    }
    else {
      dispatch({
        type: "change-mode",
        mode: tool,
      })
    }

    if (tool === selectedTool) {
      setSelectedTool("")
    }
    else {
      setSelectedTool(tool)
    }
  }

  return (
    <Flexbox
      flex="flex"
      align="center"
    >
      {tools.map((tool) => (
        <ToolItem
          key={tool.name}
          id={`tool-${tool.name}`}
          onClick={() => handleSelectTool(tool.name)}
          className={selectedTool === tool.name ? "is-active" : null}
          ref={tool.name === "list" ? toolRef : null}
        >
          <Icon>
            <ToolIcon 
              name={tool.name} 
              weight="bold"
              color={selectedTool === tool.name ? colors.gray.oneHundred : colors.gray.nineHundred}
            />
          </Icon>
        </ToolItem>
      ))}
      {selectedTool === "list" && (
        <EditorSettingsMenu
          setSelectedTool={handleSelectTool}
          toolRef={toolRef}
        />
      )}
    </Flexbox>
  )
}

export default ToolBox
