import React from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"

const PageWrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: 0.2s background-color, 0.2s color;
  }
  &.is-active {
    span {
      background-color: ${colors.primary.sixHundred};
    }
    p {
      background-color: ${colors.primary.sixHundred};
      color: ${colors.primary.white};
    }
    div {
      border-color: ${colors.primary.sixHundred};
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      span {
        background-color: ${colors.gray.nineHundred};
      }
      p {
        color: ${colors.gray.nineHundred};
      }
      div {
        border-color: ${colors.gray.nineHundred};
      }
    }
  }
`

const PageOutline = styled.div`
  border-radius: 0.25rem;
  border: 1px solid ${props => props.bordercolor || colors.gray.sixHundred};
  height: ${props => props.height || "30px"};
  position: relative;
  width: ${props => props.width || "22px"};
`

const VerticalLine = styled.span`
  display: block;
  background-color: ${props => props.backgroundcolor || colors.gray.sixHundred};
  height: ${props => props.height || "100%"};
  transition: background-color 0.2s;
  width: ${props => props.width || "1px"};
`

const Dot = styled.span`
  border-radius: 100%;
  background-color: ${props => props.backgroundcolor || colors.gray.sixHundred};
  height: ${props => props.height || "3px"};
  transition: background-color 0.2s;
  width: ${props => props.width || "3px"};
`

const HorizontalLine = styled.span`
  display: block;
  background-color: ${props => props.backgroundcolor || colors.gray.sixHundred};
  height: ${props => props.height || "1px"};
  transition: background-color 0.2s;
  width: ${props => props.width || "100%"};
`

const GraphOutline = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-around;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  &.is-horizontal {
    flex-direction: column;
  }
`

const PageLabel = styled.p`
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: ${colors.gray.sevenHundred};
`

function RuledPageIcon({ handleTemplateSelect, isActive }) {
  return (
    <PageWrapper
      onClick={() => handleTemplateSelect("ruled")}
      className={isActive ? "is-active" : null}
    >
      <PageOutline>
        <Flexbox
          flex="flex"
          justifycontent="space-around"
          flexdirection="column"
          width="100%"
          height="100%"
        >
          <HorizontalLine />
          <HorizontalLine />
          <HorizontalLine />
          <HorizontalLine />
          <HorizontalLine />
        </Flexbox>
      </PageOutline>
      <PageLabel margin="0.5rem 0 0 0">Ruled</PageLabel>
    </PageWrapper>
  )
}

function DotPageIcon({ handleTemplateSelect, isActive }) {
  return (
    <PageWrapper
      onClick={() => handleTemplateSelect("dot")}
      className={isActive ? "is-active" : null}
    >
      <PageOutline>
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          justifycontent="space-around"
          alignitems="center"
          width="100%"
          height="100%"
        >
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-around"
            width="100%"
          >
            <Dot />
            <Dot />
          </Flexbox>
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-around"
            width="100%"
          >
            <Dot />
            <Dot />
          </Flexbox>
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-around"
            width="100%"
          >
            <Dot />
            <Dot />
          </Flexbox>
        </Flexbox>
      </PageOutline>
      <PageLabel margin="0.5rem 0 0 0">Dot grid</PageLabel>
    </PageWrapper>
  )
}

function GraphPageIcon({ handleTemplateSelect, isActive }) {
  return (
    <PageWrapper
      onClick={() => handleTemplateSelect("graph")}
      className={isActive ? "is-active" : null}
    >
      <PageOutline>
        <GraphOutline>
          <VerticalLine />
          <VerticalLine />
          <VerticalLine />
        </GraphOutline>
        <GraphOutline className="is-horizontal">
          <HorizontalLine />
          <HorizontalLine />
          <HorizontalLine />
        </GraphOutline>
      </PageOutline>
      <PageLabel margin="0.5rem 0 0 0">Graph</PageLabel>
    </PageWrapper>
  )
}

function BlankPageIcon({ handleTemplateSelect, isActive }) {
  return (
    <PageWrapper
      onClick={() => handleTemplateSelect("blank")}
      className={isActive ? "is-active" : null}
    >
      <PageOutline />
      <PageLabel margin="0.5rem 0 0 0">Blank</PageLabel>
    </PageWrapper>
  )
}

export {
  RuledPageIcon,
  BlankPageIcon,
  DotPageIcon,
  GraphPageIcon,
}
