import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { CSSTransitionGroup } from 'react-transition-group'
import styled from "styled-components"
import { colors } from "../styles/variables"
import Logo from "../assets/logo2.svg"

const StyledTableOfContents = styled.div`
  background: ${colors.primary.sevenHundred};
  box-shadow: 2px 4px 12px ${colors.shadow.float};
  width: 300px;
  overflow-y: auto;
  .toc-enter {
    opacity: 0.01;
    transform: translateY(-5px);
  }
  .toc-enter.toc-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: transform 200ms ease-in, opacity 200ms ease-in;
  }
  .toc-leave {
    opacity: 1;
    transform: translateY(0));
  }
  .toc-leave.toc-leave-active {
    opacity: 0.01;
    transform: translateY(-5px);
    transition: transform 200ms ease-in, opacity 200ms ease-in;
  }
`

const ContentBox = styled.div`
  align-items: center;
  display: flex;
  padding: 1rem 2rem;
  justify-content: space-between;
  h3 {
    color: ${colors.primary.threeHundred};
    font-size: 1rem;
    margin-bottom: 0;
  }
  p {
    color: ${colors.primary.threeHundred};
    display: inline-block;
    line-height: 1;
    margin-bottom: 0;
    position: relative;
    &::before {
      background-color: transparent;
      bottom: -2px;
      content: "";
      height: 2px;
      left: 0;
      position: absolute;
      transition: background-color 0.2s, width 0.2s;
      width: 0;
    }
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &.is-active {
    h3 {
      color: ${colors.primary.oneHundred};
    }
    p {
      color: ${colors.primary.oneHundred};
      &::before {
        background-color: ${colors.highlighter};
        width: 100%;
      }
    }
  }
  &:hover {
    &:not(.is-active) {
      h3 {
        color: ${colors.primary.oneHundred};
      }
      p {
        color: ${colors.primary.oneHundred};
      }
    }
  }
`

function TableOfContents(props) {

  const chapters = useStaticQuery(graphql`
    query tableOfContentsQuery {
      allContentfulChapter(sort: {fields: [chapterNumber], order: ASC}) {
        edges {
          node {
            id
            title
            chapterNumber
            chapterName
            slug
          }
        }
      }
    }
  `)

  return (
    <StyledTableOfContents>
      <CSSTransitionGroup
        transitionName="toc"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
      <Logo style={{margin:"1rem 2rem"}} height="50" width="147" fill="white"/>
      {chapters.allContentfulChapter.edges.map(({ node: chapter }) => (
        <Link to={`/${chapter.slug}`} key={chapter.id}>
          <ContentBox className={props.chapterName === chapter.chapterName ? "is-active" : null}>
            <h3>{chapter.chapterNumber}</h3>
            <p>{chapter.chapterName}</p>
          </ContentBox>
        </Link>
      ))}
      </CSSTransitionGroup>
    </StyledTableOfContents>
  )
}

export default TableOfContents
