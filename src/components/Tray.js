import React, { useContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import TrayContext from "../context/TrayContext"
import styled from "styled-components"
import { colors } from "../styles/variables"

import Icon from "./Icon"

const StyledTray = styled.div`
  align-items: center;
  background-color: ${colors.white};
  box-shadow: 2px 4px 12px ${colors.shadow.float};
  border-radius: 0.25rem;
  display: flex;
  margin-top: 2rem;
  position: relative;
`

const StyledTrayItemTracker = styled.span`
  background: ${colors.cream};
  border: 2px solid ${colors.primary.sixHundred};
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: translateY(0);
  transition: transform .3s cubic-bezier(.165,.84,.44,1);
  width: calc(100% / 3);
  will-change: transform;
`

const TrayItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  padding: 1rem;
  position: relative;
  p {
    margin: 0;
    font-size: 1.1rem;
  }
  &:hover {
    cursor: pointer;
  }
`


function TrayItemTracker(props) {
  const position = {
    transform: `translateX(${props.itemNumber * 100}%)`
  }

  return (
    <StyledTrayItemTracker style={position} />
  )
}

function Tray(props) {

  const trayContext = useContext(TrayContext)
  const { activeTrayItem, setActiveTrayItem } = trayContext

  return (
    <StyledTray>
      <TrayItemTracker itemNumber={activeTrayItem} />
      {props.chapterContent.edges.map(({ node: trayItem}) => (
        <TrayItem
          key={trayItem.title}
          className={trayItem.trayNumber === activeTrayItem ? "is-active" : null}
          onClick={() => setActiveTrayItem(trayItem.trayNumber)}
        >
          <Icon icon={trayItem.icon} height="1.25rem" width="1.25rem" />
          <p>{trayItem.title}</p>
        </TrayItem>
      ))}
    </StyledTray>
  )
}

export default Tray
