import React, { useContext } from "react"
import styled from "styled-components"
import StepContext from "../context/StepContext"
import { colors } from "../styles/variables"

import Handwriting from "./Handwriting"
import Icon from "./Icon"

const StyledStep = styled.div`
  position: relative;
`

const StepItem = styled.div`
  background: ${colors.white};
  border-radius: 0.25rem 0 0.25rem 0.25rem;
  box-shadow: -4px 4px 1px ${colors.shadow.float};
  display: flex;
  padding: 1rem;
  overflow: hidden;
  position: relative;
  width: 100%;
  transition: box-shadow 0.2s;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &::before {
    border-color: ${colors.white};
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    transition: all 0.2s;
  }
  &.is-active {
    box-shadow: -4px 4px 1px ${colors.primary.sixHundred};
    &::before {
      background: ${colors.white};
      border-color: ${colors.cream} ${colors.cream} ${colors.primary.sixHundred} ${colors.primary.sixHundred};
      border-radius: 0 0 0 5px;
      border-style: solid;
      border-width: 1.5rem;
      box-shadow: -2px 2px 6px ${colors.shadow.float};
    }
  }
`

const StyledStepTracker = styled.div`
  background: ${colors.primary.sixHundred};
  border-radius: 100%;
  box-shadow: 0 4px 8px ${colors.shadow.float};
  height: 0.5rem;
  left: -1rem;
  position: absolute;
  top: 0;
  transform: translateY(1.5rem);
  transition: transform .3s cubic-bezier(.165,.84,.44,1);
  width: 0.5rem;
  will-change: transform;
`

function StepTracker(props) {
  const position = {
    transform: `translateY(${props.itemNumber * 100}%)`
  }

  return (
    <StyledStepTracker style={position} />
  )
}

function Step(props) {

  const stepContext = useContext(StepContext)
  const { activeStepItem, setActiveStepItem } = stepContext
  console.log(activeStepItem)

  return (
    <StyledStep>
      {props.chapterContent.edges.map(({ node: stepItem}) => (
        <>
          <Handwriting textAlign="flex-start">Step {stepItem.trayNumber}</Handwriting>
          <StepItem
            key={stepItem.title}
            className={stepItem.trayNumber === activeStepItem ? "is-active" : null}
            onClick={() => setActiveStepItem(stepItem.trayNumber)}
          >
            <Icon icon={stepItem.icon} height="1.25rem" width="1.25rem" />
            <p>{stepItem.title}</p>
          </StepItem>
        </>
      ))}
    </StyledStep>
  )
}

export default Step
