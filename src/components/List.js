import React from "react"
import styled from "styled-components"
import Icon from "./Icon"
import { colors } from "../styles/variables"

const ListWrapper = styled.ul`
  list-style: none;
`

const ListItem = styled.li`
  align-items: center;
  background-color: ${colors.white};
  border-left: ${props => props.dark ? `4px solid ${colors.primary.oneHundred}` : `4px solid ${colors.primary.sixHundred}`};
  box-shadow: 0 1px 3px ${colors.shadow.float}, 0 0 1px ${colors.shadow.float};
  color: ${props => props.dark ? colors.primary.oneHundred : colors.primary.sevenHundred};
  display: flex;
  justify-content: flex-start;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &.has-icon {
    span {
      margin-right: 0.5rem;
    }
  }
`

function List(props) {
  const { list } = props

  return (
    <ListWrapper>
      {list.map(listItem => (
        <ListItem key={listItem.text} className="has-icon">
          <Icon>
            {listItem.icon}
          </Icon>
          <p>{listItem.text}</p>
        </ListItem>
      ))}
    </ListWrapper>
  )
}

export default List
