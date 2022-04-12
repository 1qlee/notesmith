import React from "react"
import styled from "styled-components"
import { colors } from "../styles/variables"

const BreadcrumbContainer = styled.nav`
  display: block;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  ul {
    display: flex;
    list-style-type: none;
  }
  li {
    position: relative;
    &.is-disabled {
      a {
        cursor: not-allowed;
        &:hover {
          color: ${colors.primary.threeHundred};
        }
      }
    }
    &:not(:last-child) {
      &::before {
        content: "/";
        position: absolute;
        color: ${colors.primary.threeHundred};
        right: -0.35rem;
      }
    }
  }
  a {
    color: ${colors.primary.threeHundred};
    position: relative;
    padding: 0 0.75rem 0 1rem;
    &.is-active {
      color: ${colors.primary.sixHundred};
    }
    &.first {
      padding-left: 0;
    }
    &:hover {
      color: ${colors.primary.sixHundred};
    }
  }
`

function Breadcrumb(props) {
  return (
    <BreadcrumbContainer>
      {props.children}
    </BreadcrumbContainer>
  )
}

export default Breadcrumb
