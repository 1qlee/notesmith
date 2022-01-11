import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { Cursor, Pencil } from "phosphor-react"
import { useFirebaseContext } from "../../../utils/auth"

import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"
import Button from "../../Button"

const ToolItem = styled.div`
  color: ${colors.white};
  padding: 0.5rem;
`

function Toolbar({ children, page, setShowTemplates }) {
  const { firebaseDb } = useFirebaseContext()

  function createLines() {
    console.log('lined')
  }

  function createFromTemplate(template) {
    switch(template) {
      case "none":
        break
      case "lined":
        createLines()
        break
      case "dotted":
        console.log("dotted")
        break
      default:
        console.log("default")
    }
  }

  return (
    <>
      <Flexbox
        flex="flex"
        alignitems="center"
      >
        <ToolItem>
          <p onClick={() => setShowTemplates(state => !state)}>Templates</p>
        </ToolItem>
        <ToolItem>
          <Icon>
            <Pencil />
          </Icon>
        </ToolItem>
        <ToolItem>Object</ToolItem>
        <ToolItem>View</ToolItem>
        {children}
      </Flexbox>
    </>
  )
}

export default Toolbar
