import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

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
          color: ${colors.gray.threeHundred};
        }
      }
    }
    &:not(:last-child) {
      &::before {
        content: "/";
        position: absolute;
        color: ${colors.gray.sixHundred};
        right: -0.35rem;
      }
    }
  }
  a {
    color: ${colors.gray.sixHundred};
    position: relative;
    padding: 0 0.75rem 0 1rem;
    &.is-active {
      color: ${colors.gray.nineHundred};
    }
    &.first {
      padding-left: 0;
    }
    &:hover {
      color: ${colors.gray.sixHundred};
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
