import React from "react"
import styled from "styled-components"
import { colors, fonts, convertToMM } from "../../styles/variables"
import { Plus } from "phosphor-react"
import ReactTooltip from "react-tooltip"
import IsoPageIcon from "../../assets/iso-grid.svg"
import HexPageIcon from "../../assets/hexagon-grid.svg"
import SeyesIcon from "../../assets/seyes.svg"
import CalligraphyIcon from "../../assets/calligraphy.svg"

import { Flexbox } from "../layout/Flexbox"
import Icon from "../Icon"

const StyledPage = styled.a`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: ${props => props.margin};
  position: relative;
  p {
    padding: 0.25rem;
    transition: 0.2s background-color, 0.2s color;
  }
  .page-outline {
    transition: transform 0.2s;
  }
  &.is-active {
    p {
      background-color: ${colors.gray.nineHundred};
      color: ${colors.gray.oneHundred};
    }
    .page-outline {
      border-color: ${colors.gray.nineHundred};
      box-shadow: 2px 2px 0 ${colors.gray.nineHundred};
      transform: translate(-2px,-2px);
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
    }
  }
  &:focus {
    p {
      background-color: ${colors.gray.nineHundred};
      color: ${colors.gray.oneHundred};
    }
    .page-outline {
      border-color: ${colors.gray.nineHundred};
      box-shadow: ${colors.shadow.layeredSmall}
      transform: scale(1.05);
    }
  }
`

const PageBadge = styled.span`
  align-items: center;
  background-color: ${colors.yellow.threeHundred};
  border-radius: 20px;
  color: ${colors.gray.nineHundred};
  display: flex;
  font-family: ${fonts.secondary};
  font-size: 0.625rem;
  justify-content: center;
  left: ${props => props.left};
  padding: 4px;
  height: 1rem;
  width: 1rem;
  position: absolute;
  right: ${props => props.right};
  top: -0.5rem;
  z-index: 9;
`

const PageOutline = styled.div`
  border: 1px solid ${props => props.bordercolor || colors.gray.nineHundred};
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
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: ${colors.gray.sevenHundred};
`

function Page({
  children,
  data,
  dataTip,
  isActive,
  isProductPage,
  leftPageData,
  margin,
  rightPageData,
  setData,
}) {
  return (
    <StyledPage
      onClick={() => setData(data)}
      className={isActive ? "is-active" : null}
      margin={margin}
      data-tip={dataTip}
    >
      {(isProductPage && leftPageData.template === data.template) && (
        <PageBadge
          left="-0.5rem"
        >
          L
        </PageBadge>
      )}
      {(isProductPage && rightPageData.template === data.template) && (
        <PageBadge
          right="-0.5rem"
        >
          R
        </PageBadge>
      )}
      {children}
    </StyledPage>
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "ruled",
    spacing: 5,
    opacity: 1,
    thickness: 0.088,
    rows: 42,
    columns: 26,
    marginTop: 0.379,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: 127,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          justifycontent="space-around"
          flexdirection="column"
          alignitems="center"
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
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "dot",
    spacing: 5,
    opacity: 1,
    thickness: 0.175,
    radius: 0.1,
    rows: 42,
    columns: 25,
    marginTop: 0.123,
    marginBottom: 0,
    marginLeft: 1.881,
    marginRight: 0,
    width: 1,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
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
            <Dot />
          </Flexbox>
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Dot grid</PageLabel>
      ) : (
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "graph",
    spacing: 5,
    opacity: 1,
    thickness: 0.088,
    rows: 41,
    columns: 24,
    marginTop: 0.335,
    marginLeft: 2.036,
    width: 127,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
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
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "blank",
    spacing: 5,
    opacity: 1,
    thickness: 0.175,
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
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline" />
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Blank</PageLabel>
      ) : (
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "hexagon",
    opacity: 1,
    thickness: 0.088,
    hexagonRadius: 5,
    rows: 30,
    columns: 16,
    marginTop: -7.902,
    marginLeft: -8.442,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="center"
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
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "isometric",
    opacity: 1,
    angle: 60,
    thickness: 0.088,
    spacing: 5,
    contentWidth: convertToMM(data.pageWidth),
    contentHeight: convertToMM(data.pageHeight),
    marginTop: 0,
    marginLeft: 0,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="center"
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
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "",
    alignmentVertical: "",
    show: isProductPage ? true : false,
    template: "seyes",
    opacity: 1,
    thickness: 0.088,
    spacing: 2,
    rows: 91,
    columns: 12,
    marginTop: 15,
    marginLeft: 30,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="center"
          width="100%"
          height="100%"
        >
          <SeyesIcon />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Seyes</PageLabel>
      ) : (
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "music",
    opacity: 1,
    thickness: 0.088,
    spacing: 2,
    groupSpacing: 7,
    rows: 14,
    marginTop: 0.147,
    marginLeft: 0,
    marginRight: 0,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          flexdirection="column"
          alignitems="center"
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
          alignitems="center"
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
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "handwriting",
    opacity: 1,
    thickness: 0.088,
    spacing: 5,
    groupSpacing: 5,
    rows: 14,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          flexdirection="column"
          alignitems="center"
          justifycontent="space-between"
          height="8px"
          margin="8px 0"
        >
          <HorizontalLine width="80%" />
          <Flexbox
            flex="flex"
            justifycontent="space-around"
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
          alignitems="center"
          justifycontent="space-between"
          height="8px"
          margin="0.25rem 0"
        >
          <HorizontalLine width="80%" />
          <Flexbox
            flex="flex"
            justifycontent="space-around"
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
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "calligraphy",
    opacity: 1,
    thickness: 0.088,
    spacing: 5,
    groupSpacing: 5,
    slants: 28,
    rows: 14,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          alignitems="center"
          justifycontent="center"
          width="100%"
          height="100%"
        >
          <CalligraphyIcon />
        </Flexbox>
      </PageOutline>
      {showLabels ? (
        <PageLabel margin="0.5rem 0 0 0">Calligraphy</PageLabel>
      ) : (
        <ReactTooltip
          effect="solid"
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
  showLabels,
}) {
  const newData = {
    ...data,
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    show: isProductPage ? true : false,
    template: "cross",
    opacity: 1,
    spacing: 5,
    rows: 35,
    columns: 21,
    marginTop: 2.271,
    marginLeft: 2.68,
  }

  return (
    <Page
      dataTip={dataTip}
      data={newData}
      isActive={isActive}
      isProductPage={isProductPage}
      leftPageData={leftPageData}
      margin={iconMargin}
      rightPageData={rightPageData}
      setData={setData}
    >
      <PageOutline className="page-outline">
        <Flexbox
          flex="flex"
          alignitems="center"
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
          alignitems="center"
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
          alignitems="center"
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
        <PageLabel margin="0.5rem 0 0 0">Cross grid</PageLabel>
      ) : (
        <ReactTooltip
          effect="solid"
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
  leftPageData,
  rightPageData,
  setData,
  showLabels,
}) {
  return (
    <>
      <BlankPageIcon
        data={data}
        dataTip="Blank"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "blank"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
        setData={setData}
        showLabels={showLabels}
      />
      <RuledPageIcon
        data={data}
        dataTip="Ruled"
        iconMargin={iconMargin}
        isActive={checkActiveVar === "ruled"}
        isProductPage={isProductPage}
        leftPageData={leftPageData}
        rightPageData={rightPageData}
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
        setData={setData}
        showLabels={showLabels}
      />
    </>
  )
}

export default PageIcons
