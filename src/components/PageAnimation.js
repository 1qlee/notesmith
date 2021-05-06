import React, { useState } from "react"
import styled, { keyframes } from "styled-components"
import { colors } from "../styles/variables"
import { ArrowBendLeftUp, Smiley, SmileyMeh, SmileySad, Square, CheckSquare, ArrowClockwise } from "phosphor-react"

import Content from "./Content"
import { Flexbox } from "./layout/Flexbox"
import Icon from "./Icon"
import Button from "./Button"

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const PageAnimationWrapper = styled.div`
  display: flex;
  max-width: 980px;
  margin: 0 auto;
  @media only screen and (max-width: 1076px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`

const PageContainer = styled.div`
  align-items: center;
  background-color: ${colors.paper.offWhite};
  box-shadow: 0 1px 3px ${colors.shadow.dark}, 0 0 1px ${colors.shadow.dark};
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  justify-content: center;
  padding: 1rem;
  transition: all 0.4s;
  width: 200px;
  &.has-margin-right {
    margin-right: 1rem;
  }
  &.is-active {
    margin-right: 0;
    border-right: 1px solid ${colors.gray.threeHundred};
  }
`

const PageAnimationLink = styled.p`
  opacity: 0.5;
  position: relative;
  display: inline-block;
  margin-left: auto;
  &.is-active {
    opacity: 1;
    &::before {
      left: 0;
      opacity: 1;
      width: 100%;
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      opacity: 0.75;
    }
  }
  &::before {
    content: "";
    width: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    opacity: 0;
    box-shadow: 0 1px 0 ${colors.primary.whiteLight};
    transition: all 0.4s;
  }
`

const Line = styled.span`
  animation: ${fadeIn} 0.4s linear;
  display: block;
  height: 0.25rem;
  width: 100%;
  margin-bottom: 1rem;
  background-color: ${colors.gray.nineHundred};
  transition: all 0.4s;
  &.is-animated {
    margin-bottom: 0.25rem;
  }
  &.is-thin {
    height: 0.125rem;
  }
`

const Dot = styled.span`
  animation: ${fadeIn} 0.4s linear;
  border-radius: 100%;
  display: inline-block;
  margin: 1rem;
  height: 0.5rem;
  width: 0.5rem;
  background-color: ${colors.gray.nineHundred};
  transition: all 0.4s;
  &.is-animated {
    height: 0.25rem;
    width: 0.25rem;
    background-color: ${colors.gray.sixHundred};
  }
`

const PageTitle = styled.h3`
  animation: ${fadeIn} 0.4s linear;
`

const PageAnimation = () => {
  const [lineNumber, setLineNumber] = useState({
    one: false,
    two: false,
    three: false,
    four: false
  })

  const handleClick = (num) => {
    switch(num) {
      case 1:
        setLineNumber({...lineNumber, one: true})
        break
      case 2:
        if (!lineNumber.one) {
          break
        }
        else {
          setLineNumber({...lineNumber, two: true})
        }
        break
      case 3:
        if (!lineNumber.one || !lineNumber.two) {
          break
        }
        else {
          setLineNumber({...lineNumber, three: true})
        }
        break
      case 4:
        if (!lineNumber.one || !lineNumber.two || !lineNumber.three) {
          break
        }
        else {
          setLineNumber({...lineNumber, four: true})
        }
        break
      default:
        break
    }
  }

  return (
    <PageAnimationWrapper>
      <Content
        margin="3rem 2rem 0 0"
        paragraphfontsize="1.5rem"
        headingtextalign="center"
        paragraphcolor={colors.primary.whiteLight}
        paragraphmarginbottom="0"
      >
        <Flexbox
          flex="flex"
          margin="0 0 1rem"
          onClick={() => handleClick(1)}
        >
          <PageAnimationLink
            className={lineNumber.one? "is-active" : null}
          >
            and wished the dots were smaller and lighter
          </PageAnimationLink>
          <Icon margin="0 0 0 1rem">
            {lineNumber.one ? (
              <CheckSquare size="1.5rem" color={colors.primary.white} />
            ) : (
              <Square size="1.5rem" color={colors.primary.whiteLight} />
            )}
          </Icon>
        </Flexbox>
        <Flexbox
          flex="flex"
          margin="0 0 1rem"
          onClick={() => handleClick(2)}
        >
          <PageAnimationLink
            className={lineNumber.two ? "is-active" : null}
          >
            or the lines were spaced closer together
          </PageAnimationLink>
          <Icon margin="0 0 0 1rem">
            {lineNumber.two ? (
              <CheckSquare size="1.5rem" color={colors.primary.white} />
            ) : (
              <Square size="1.5rem" color={colors.primary.whiteLight} />
            )}
          </Icon>
        </Flexbox>
        <Flexbox
          flex="flex"
          margin="0 0 1rem"
          onClick={() => handleClick(3)}
        >
          <PageAnimationLink
            className={lineNumber.three ? "is-active" : null}
          >
            or had different layouts in each page?
          </PageAnimationLink>
          <Icon margin="0 0 0 1rem">
            {lineNumber.three ? (
              <CheckSquare size="1.5rem" color={colors.primary.white} />
            ) : (
              <Square size="1.5rem" color={colors.primary.whiteLight} />
            )}
          </Icon>
        </Flexbox>
        <Flexbox
          flex="flex"
          margin="0 0 1rem"
          onClick={() => handleClick(4)}
        >
          <PageAnimationLink
            className={lineNumber.four ? "is-active" : null}
          >
            Or perhaps something more creative...
          </PageAnimationLink>
          <Icon margin="0 0 0 1rem">
            {lineNumber.four ? (
              <CheckSquare size="1.5rem" color={colors.primary.white} />
            ) : (
              <Square size="1.5rem" color={colors.primary.whiteLight} />
            )}
          </Icon>
        </Flexbox>
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="flex-end"
        >
          <Content
            paragraphfontsize="1rem"
            margin="0 1rem 0 0"
            paragraphcolor={colors.primary.whiteLight}
          >
            <Flexbox
              flex="flex"
              alignitems="center"
            >
              <Icon>
                <ArrowBendLeftUp size="1rem" color={colors.primary.whiteLight} />
              </Icon>
              <p>Please click us in order</p>
            </Flexbox>
          </Content>
          <Button
            padding="0.25rem 0.5rem"
            backgroundcolor={colors.white}
            onClick={() => setLineNumber({
              one: false,
              two: false,
              three: false,
              four: false
            })}
          >
            <Icon margin="0 0.25rem 0 0">
              <ArrowClockwise size="1rem" color={colors.gray.nineHundred} />
            </Icon>
            <span>Reset</span>
          </Button>
        </Flexbox>
      </Content>
      <Content
        h3color={colors.primary.white}
        h3fontweight="400"
        smallfontsize="0.6rem"
      >
        {lineNumber.four ? (
          <>
            <PageTitle>Daily Mood Tracker</PageTitle>
            <Flexbox
              flex="flex"
            >
              <PageContainer
                className="is-active"
              >
                <p>Today was a:</p>
                <Flexbox flex="flex" justifycontent="center">
                  <Icon>
                    <Smiley size="2rem" />
                  </Icon>
                  <Icon>
                    <SmileyMeh size="2rem" />
                  </Icon>
                  <Icon>
                    <SmileySad size="2rem" />
                  </Icon>
                </Flexbox>
                <p>kind of day.</p>
              </PageContainer>
              <PageContainer>
                <p>What happened today:</p>
                <Line className="is-thin" />
                <Line className="is-thin" />
                <Line className="is-thin" />
                <Line className="is-thin" />
                <Line className="is-thin" />
                <Line className="is-thin" />
              </PageContainer>
            </Flexbox>
          </>
        ) : (
          <>
            {lineNumber.three && (
              <PageTitle>The One Notebook</PageTitle>
            )}
            <Flexbox
              flex="flex"
            >
              <Content
                h3color={colors.primary.white}
                h3fontweight="400"
              >
                {!lineNumber.three && (
                  <h3>Notebook #1</h3>
                )}
                <PageContainer
                  className={lineNumber.three ? "is-active" : "has-margin-right"}
                >
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                  <Dot className={lineNumber.one ? "is-animated" : null} />
                </PageContainer>
              </Content>
              <Content
                h3color={colors.primary.white}
                h3fontweight="400"
              >
                {!lineNumber.three && (
                  <h3>Notebook #2</h3>
                )}
                <PageContainer>
                  <Line className={lineNumber.two ? "is-animated" : null} />
                  <Line className={lineNumber.two ? "is-animated" : null} />
                  <Line className={lineNumber.two ? "is-animated" : null} />
                  <Line className={lineNumber.two ? "is-animated" : null} />
                  {lineNumber.two && (
                    <>
                    <Line className={lineNumber.two ? "is-animated" : null} />
                    <Line className={lineNumber.two ? "is-animated" : null} />
                    <Line className={lineNumber.two ? "is-animated" : null} />
                    <Line className={lineNumber.two ? "is-animated" : null} />
                    </>
                  )}
                </PageContainer>
              </Content>
            </Flexbox>
          </>
        )}
      </Content>
    </PageAnimationWrapper>
  )
}

export default PageAnimation
