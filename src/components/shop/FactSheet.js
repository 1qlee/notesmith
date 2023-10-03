import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import { Files, Book, Stamp } from "@phosphor-icons/react"

import { Flexbox } from "../layout/Flexbox"
import Content from "../ui/Content"
import Icon from "../ui/Icon"

const FactSheet = styled.article`
  margin: ${props => props.margin};
  box-shadow: ${colors.shadow.solid};
  border: ${colors.borders.black};
  border-radius: 8px;
`

const StyledFactItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-bottom: 2px solid ${colors.gray.nineHundred};
`

function FactItem({
  text,
  icon
}) {
  return (
    <StyledFactItem>
      <Icon
        backgroundcolor={colors.gray.nineHundred}
        borderradius="100%"
        padding="8px"
      >
        {icon === "files" && (
          <Files 
            size="24px"
            color={colors.gray.oneHundred}
            weight="fill"
          />
        )}
        {icon === "book" && (
          <Book 
            size="24px"
            color={colors.gray.oneHundred}
            weight="fill"
          />
        )}
        {icon === "stamp" && (
          <Stamp 
            size="24px"
            color={colors.gray.oneHundred}
            weight="fill"
          />
        )}
      </Icon>
      <Content>
        <p>
          {text}
        </p>
      </Content>
    </StyledFactItem>
  )
}

export { FactSheet, FactItem }