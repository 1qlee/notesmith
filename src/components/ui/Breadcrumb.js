import React, { useState } from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import { ArrowRight } from "phosphor-react"
import { Link } from "gatsby"

import Icon from "./Icon"

const BreadcrumbContainer = styled.ul`
  margin-bottom: 32px;
  display: flex;
  list-style-type: none;
  li {
    position: relative;
    &.is-disabled {
      a {
        cursor: not-allowed;
        &:hover {
          color: ${colors.gray.threeHundred};
        }
      }
    }
  }
`

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  &.is-active {
    p {
      font-weight: 700;
      color: ${colors.gray.nineHundred};
    }
  }
  &.first {
    padding-left: 0;
  }
  &:hover {
    p {
      color: ${colors.gray.nineHundred};
    }
  }
`

const BreadcrumbText = styled.p`
  color: ${colors.gray.sixHundred};
`

function Breadcrumb({
  items,
}) {
  const [activeItem, setActiveItem] = useState(1)

  return (
    <BreadcrumbContainer>
      {items.map((item, index) => (
        <Link 
          key={item.index}
          to={item.path}
        >
          <BreadcrumbItem
            className={index === activeItem ? "is-active" : null}
          >
            <BreadcrumbText>{item.text}</BreadcrumbText>
            {index !== items.length - 1 && (
              <Icon margin="0 8px">
                /
              </Icon>
            )}
          </BreadcrumbItem>
        </Link>
      ))}
    </BreadcrumbContainer>
  )
}

export default Breadcrumb
