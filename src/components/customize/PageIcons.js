import React from "react"
import styled from "styled-components"
import { colors, fonts, pageDataConfig } from "../../styles/variables"
import { Plus, X } from "@phosphor-icons/react"
import { Tooltip } from "react-tooltip"
import IsoPageIcon from "../../assets/iso-grid.svg"
import HexPageIcon from "../../assets/hexagon-grid.svg"
import SeyesIcon from "../../assets/seyes.svg"
import CalligraphyIcon from "../../assets/calligraphy.svg"

import { Flexbox } from "../layout/Flexbox"
import Icon from "../ui/Icon"

const IconsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

const StyledPage = styled.a`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: ${props => props.margin};
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  position: relative;
  p {
    padding: 0.25rem;
    transition: 0.2s background-color;
  }
  .page-outline {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  &.is-active {
    p {
      background-color: ${colors.gray.nineHundred};
      color: ${colors.gray.oneHundred};
    }
    .page-outline {
      border-color: ${colors.gray.nineHundred};
      box-shadow: ${colors.shadow.focus};
      transform: translateY(-2px);
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      p {
        color: ${colors.gray.nineHundred};
      }
      div {
        border-color: ${colors.gray.nineHundred};
      }
      .page-outline {
        border-color: ${colors.gray.nineHundred};
        box-shadow: ${colors.shadow.hover};
        transform: translateY(-2px);
      }
    }
  }
  &:focus {
    .page-outline {
      border-color: ${colors.gray.nineHundred};
      box-shadow: 0 0 0 2px ${colors.gray.nineHundred};
      transform: translateY(-2px);
    }
  }
`

const PageBadge = styled.button`
  align-items: center;
  background-color: ${colors.white};
  border: ${colors.borders.black};
  border-radius: 20px;
  color: ${colors.gray.nineHundred};
  display: flex;
  font-family: ${fonts.secondary};
  font-size: 0.625rem;
  justify-content: center;
  left: ${props => props.left && "50%"};
  padding: 4px;
  height: 1rem;
  width: 1rem;
  line-height: 22px;
  position: absolute;
  right: ${props => props.right && "50%"};
  top: -0.5rem;
  transition: color 0.2s, background-color 0.2s;
  transform: ${props => props.left ? "translateX(-150%)" : "translateX(150%)"};
  z-index: 9;
  &.is-active {
    background-color: ${colors.gray.nineHundred};
    color: ${colors.gray.oneHundred};
  }
  &:hover {
    &:not(.is-active) {
      cursor: pointer;
      background-color: ${colors.gray.oneHundred};
    }
  }
`

const PageOutline = styled.div`
  border: ${colors.borders.black};
  border-radius: 4px;
  height: ${props => props.height || "40px"};
  background-color: ${colors.white};
  position: relative;
  width: ${props => props.width || "30px"};
`

const VerticalLine = styled.span`
  display: block;
  background-color: ${props => props.backgroundcolor || colors.gray.nineHundred};
  height: ${props => props.height || "100%"};
  margin: ${props => props.margin};
  transition: background-color 0.2s;
  width: ${props => props.width || "1px"};
`

const Dot = styled.span`
  border-radius: 100%;
  background-color: ${props => props.backgroundcolor || colors.gray.nineHundred};
  height: ${props => props.height || "1px"};
  margin: ${props => props.margin};
  transition: background-color 0.2s;
  width: ${props => props.width || "1px"};
`

const HorizontalLine = styled.span`
  display: block;
  background-color: ${props => props.backgroundcolor || colors.gray.nineHundred};
  height: ${props => props.height || "1px"};
  margin: ${props => props.margin};
  transition: background-color 0.2s;
  width: ${props => props.width || "100%"};
`

const GraphOutline = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-around;
  align-items: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  &.is-horizontal {
    flex-direction: column;
  }
`

const PageLabel = styled.p`
  font-size: 0.875rem;
  margin-top: 8px;
  border-radius: 4px;
  color: ${colors.gray.sevenHundred};
`

function Page({
  children,
  className,
  data,
  isActive,
  isProductPage,
  leftPageData,
  setLeftPageData,
  setRightPageData,
  margin,
  rightPageData,
  setData,
}) {

  function handleClick() {
    setData({ ...data, activeTemplate: null })
    // if (setLeftPageData) {
    //   setLeftPageData({ 
    //     ...data, 
    //     template: data.template,
    //     pageData: data,
    //   })
    // }
    // if (setRightPageData) {
    //   setRightPageData({
    //     ...data,
    //     template: data.template,
    //     pageData: data,
    //   })
    // }
  }

  return (
    <PageWrapper>
      <StyledPage
        onClick={handleClick}
        className={isActive ? `is-active ${className}` : className}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            setData(data)
          }
        }}
        margin={margin}
        tabIndex="0"
        aria-label={data.template}
      >
        {(isProductPage && leftPageData.template === data.template) && (
          <PageBadge
            left={true}
            onClick={() => setData({ ...leftPageData.pageData, activeTemplate: "left" })}
            className={data.activeTemplate === "left" ? "is-active" : ""}
          >
            L
          </PageBadge>
        )}
        {(isProductPage && rightPageData.template === data.template) && (
          <PageBadge
            right={true}
            onClick={() => setData({ ...rightPageData.pageData, activeTemplate: "right" })}
            className={data.activeTemplate === "right" ? "is-active" : ""}
          >
            R
          </PageBadge>
        )}
        {children}
      </StyledPage>
      
    </PageWrapper>
  )
}

function RuledPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "ruled",
    spacing: 5,
    opacity: 100,
    strokeWidth: 0.1,
    rows: 42,
    columns: 26,
    marginTop: 0.173,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: 127,
  }

  return (
    <Page
      className="ruled-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          justify="space-around"
          flexdirection="column"
          align="center"
          width="100%"
          height="100%"
        >
          <HorizontalLine width="80%" />
          <HorizontalLine width="80%" />
          <HorizontalLine width="80%" />
          <HorizontalLine width="80%" />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Ruled</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".ruled-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function DotPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    columnSpacing: 5,
    columns: 25,
    marginBottom: 0,
    marginLeft: 0.059,
    marginRight: 0,
    marginTop: 2.277,
    opacity: 100,
    radius: 0.125,
    rowSpacing: 5,
    rows: 40,
    show: isProductPage ? true : false,
    spacing: 5,
    strokeWidth: 0.175,
    template: "dot",
    width: 1,
  }

  return (
    <Page
      className="dot-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          flexwrap="wrap"
          justify="space-around"
          align="center"
          width="100%"
          height="100%"
        >
          <Flexbox
            flex="flex"
            align="center"
            justify="space-around"
            width="100%"
          >
            <Dot />
            <Dot />
            <Dot />
          </Flexbox>
          <Flexbox
            flex="flex"
            align="center"
            justify="space-around"
            width="100%"
          >
            <Dot />
            <Dot />
            <Dot />
          </Flexbox>
          <Flexbox
            flex="flex"
            align="center"
            justify="space-around"
            width="100%"
          >
            <Dot />
            <Dot />
            <Dot />
          </Flexbox>
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Dots</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".dot-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function GraphPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    columnSpacing: 5,
    columns: 24,
    marginBottom: 0,
    marginLeft: 1.881,
    marginRight: 0,
    marginTop: 0.123,
    opacity: 100,
    rowSpacing: 5,
    rows: 41,
    show: isProductPage ? true : false,
    spacing: 5,
    strokeWidth: 0.1,
    template: "graph",
    width: 127,
  }

  return (
    <Page
      className="graph-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <GraphOutline>
          <VerticalLine height="80%" />
          <VerticalLine height="80%" />
          <VerticalLine height="80%" />
          <VerticalLine height="80%" />
        </GraphOutline>
        <GraphOutline className="is-horizontal">
          <HorizontalLine width="80%" />
          <HorizontalLine width="80%" />
          <HorizontalLine width="80%" />
          <HorizontalLine width="80%" />
        </GraphOutline>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Graph</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".graph-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function BlankPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "blank",
    spacing: 5,
    opacity: 100,
    strokeWidth: 0.333,
    rows: 42,
    columns: 26,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: 1,
  }

  return (
    <Page
      className="blank-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline" />
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Blank</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".blank-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function HexagonPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "hexagon",
    opacity: 100,
    strokeWidth: 0.1,
    hexagonRadius: 5,
    rows: 27,
    columns: 28,
    marginTop: 2.237,
    marginLeft: 0.344,
    marginRight: 0,
    marginBottom: 0,
  }

  return (
    <Page
      className="hex-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          align="center"
          justify="center"
          height="100%"
          width="100%"
        >
          <Icon>
            <HexPageIcon />
          </Icon>
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Hexagon</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".hex-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function IsometricPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    borderData: {
      sync: true,
      toggle: false,
      strokeWidth: 0.1,
      opacity: 100,
    },
    show: isProductPage ? true : false,
    template: "isometric",
    opacity: 100,
    angle: 60,
    strokeWidth: 0.1,
    rows: 12,
    spacing: 5,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  }

  return (
    <Page
      className="iso-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          align="center"
          justify="center"
          height="100%"
          width="100%"
        >
          <Icon>
            <IsoPageIcon />
          </Icon>
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Isometric</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".iso-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function SeyesPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "seyes",
    opacity: 100,
    strokeWidth: 0.1,
    spacing: 2,
    rows: 91,
    columns: 12,
    columnSpacing: 30,
    rowSpacing: 15,
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 0,
  }

  return (
    <Page
      className="seyes-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          align="center"
          justify="center"
          width="100%"
          height="100%"
        >
          <SeyesIcon />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Seyes</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".seyes-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function MusicPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "music",
    opacity: 100,
    strokeWidth: 0.1,
    spacing: 2,
    staffSpacing: 5,
    staves: 15,
    marginTop: 5.974,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  }

  return (
    <Page
      className="music-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          flexdirection="column"
          align="center"
          height="12px"
          width="100%"
          margin="6px 0 0"
        >
          <HorizontalLine width="80%" margin="2px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          align="center"
          height="12px"
          width="100%"
        >
          <HorizontalLine width="80%" margin="2px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
          <HorizontalLine width="80%" margin="1px 0 0 0" />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Music</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".music-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function HandwritingPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "handwriting",
    opacity: 100,
    strokeWidth: 0.1,
    spacing: 5,
    rowSpacing: 1,
    rows: 18,
    marginTop: 3.522,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  }

  return (
    <Page
      className="hand-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          flexdirection="column"
          align="center"
          justify="space-between"
          height="8px"
          margin="8px 0"
        >
          <HorizontalLine width="80%" />
          <Flexbox
            flex="flex"
            justify="space-around"
            width="80%"
          >
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
          </Flexbox>
          <HorizontalLine width="80%" />
        </Flexbox>
        <Flexbox
          flex="flex"
          flexdirection="column"
          align="center"
          justify="space-between"
          height="8px"
          margin="0.25rem 0"
        >
          <HorizontalLine width="80%" />
          <Flexbox
            flex="flex"
            justify="space-around"
            width="80%"
          >
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
            <HorizontalLine width="1px" />
          </Flexbox>
          <HorizontalLine width="80%" />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Handwriting</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".hand-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function CalligraphyPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "calligraphy",
    ascSpacing: 5,
    dscSpacing: 5,
    xHeight: 5,
    opacity: 100,
    strokeWidth: 0.1,
    spacing: 5,
    rowSpacing: 1,
    slantSpacing: 5,
    slants: 29,
    rows: 12,
    marginTop: 6.922,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  }

  return (
    <Page
      className="calligraphy-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          align="center"
          justify="center"
          width="100%"
          height="100%"
        >
          <CalligraphyIcon />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Calligraphy</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".calligraphy-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function CrossGridPageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  setLeftPageData,
  setRightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "cross",
    crossSize: 1,
    opacity: 100,
    rowSpacing: 5,
    columnSpacing: 5,
    spacing: 5,
    rows: 35,
    columns: 21,
    marginTop: 2.082,
    marginBottom: 0,
    marginLeft: 2.491,
    marginRight: 0,
  }

  return (
    <Page
      className="cross-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      setLeftPageData={setLeftPageData}
      setRightPageData={setRightPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          align="center"
          margin="6px 0 0 "
        >
          <Icon width="100%" height="100%">
            <Plus
              size="0.5rem"
              color={colors.gray.nineHundred}
            />
          </Icon>
          <Icon width="100%" height="100%">
            <Plus
              size="0.5rem"
              color={colors.gray.nineHundred}
            />
          </Icon>
        </Flexbox>
        <Flexbox
          flex="flex"
          align="center"
        >
          <Icon width="100%" height="100%">
            <Plus
              size="0.5rem"
              color={colors.gray.nineHundred}
            />
          </Icon>
          <Icon width="100%" height="100%">
            <Plus
              size="0.5rem"
              color={colors.gray.nineHundred}
            />
          </Icon>
        </Flexbox>
        <Flexbox
          flex="flex"
          align="center"
        >
          <Icon width="100%" height="100%">
            <Plus
              size="0.5rem"
              color={colors.gray.nineHundred}
            />
          </Icon>
          <Icon width="100%" height="100%">
            <Plus
              size="0.5rem"
              color={colors.gray.nineHundred}
            />
          </Icon>
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Crosses</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".cross-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function NonePageIcon({
  setData,
  data,
  dataTip,
  isActive,
  isProductPage,
  iconMargin,
  leftPageData,
  rightPageData,
  showLabels,
}) {
  const newData = {
    ...data,
    ...pageDataConfig,
    template: ""
  }

  return (
    <Page
      className="none-tooltip"
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline 
        className="page-outline"
      >
        <Icon
          margin="10px 6px"
        >
          <X size={16} />
        </Icon>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">None</PageLabel>
      ) : (
        <Tooltip
          anchorSelect=".none-tooltip"
          content={dataTip}
          place="top"
        />
      )}
    </Page>
  )
}

function PageIcons({
  checkActiveVar,
  data,
  iconMargin,
  isProductPage,
  hideNone,
  hideBlank,
  leftPageData,
  setLeftPageData,
  rightPageData,
  setRightPageData,
  setData,
  showLabels,
}) {
  return (
    <IconsWrapper>
      {!hideNone && (
        <NonePageIcon
          data={data}
          dataTip="None"
          iconMargin={iconMargin}
          isActive={checkActiveVar === ""}
          isProductPage={isProductPage}
          leftPageData={leftPageData}
          rightPageData={rightPageData}
          setData={setData}
          showLabels={showLabels}
        />
      )}
      {!hideBlank && (
        <BlankPageIcon
          data={data}
          dataTip="Blank"
          iconMargin={iconMargin}
          isActive={checkActiveVar === "blank"}
          isProductPage={isProductPage}
          leftPageData={leftPageData}
          rightPageData={rightPageData}
          setLeftPageData={setLeftPageData}
          setRightPageData={setRightPageData}
          setData={setData}
          showLabels={showLabels}
          tabindex="1"
        />
      )}
      <RuledPageIcon
        data={data}
        dataTip="Ruled"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "ruled"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <DotPageIcon
        data={data}
        dataTip="Dot grid"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "dot"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <GraphPageIcon
        data={data}
        dataTip="Graph"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "graph"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <HexagonPageIcon
        data={data}
        dataTip="Hexagon"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "hexagon"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <IsometricPageIcon
        data={data}
        dataTip="Isometric"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "isometric"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <SeyesPageIcon
        data={data}
        dataTip="Seyes"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "seyes"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <MusicPageIcon
        data={data}
        dataTip="Music"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "music"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <HandwritingPageIcon
        data={data}
        dataTip="Handwriting"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "handwriting"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <CrossGridPageIcon
        data={data}
        dataTip="Cross grid"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "cross"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <CalligraphyPageIcon
        data={data}
        dataTip="Calligraphy"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "calligraphy"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setLeftPageData={setLeftPageData}
        setRightPageData={setRightPageData}
        setData={setData}
        showLabels={showLabels}
      />
    </IconsWrapper>
  )
}

export default PageIcons
