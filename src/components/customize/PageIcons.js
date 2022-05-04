import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import ReactTooltip from "react-tooltip"

import { Flexbox } from "../layout/Flexbox"
import Content from "../Content"

const StyledPage = styled.a`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: ${props => props.margin};
  position: relative;
  p {
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: 0.2s background-color, 0.2s color;
  }
  .page-outline {
    transition: transform 0.2s;
  }
  &.is-active {
    span {
      background-color: ${colors.gray.nineHundred};
    }
    p {
      background-color: ${colors.gray.nineHundred};
      color: ${colors.primary.white};
    }
    polygon {
      stroke: ${colors.gray.nineHundred};
    }
    .page-outline {
      border-color: ${colors.primary.sixHundred};
      box-shadow: 0 0 2px ${colors.primary.active};
      transform: scale(1.05);
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
      polygon {
        stroke: ${colors.gray.nineHundred};
      }
    }
  }
  &:focus {
    span {
      background-color: ${colors.primary.sixHundred};
    }
    p {
      background-color: ${colors.primary.sixHundred};
      color: ${colors.primary.white};
    }
    .page-outline {
      border-color: ${colors.primary.sixHundred};
      box-shadow: 0 0 2px ${colors.primary.active};
      transform: scale(1.05);
    }
  }
`

const PageBadge = styled.span`
  align-items: center;
  background-color: ${colors.primary.sixHundred};
  border-radius: 20px;
  color: ${colors.primary.white};
  display: flex;
  font-family: ${fonts.secondary};
  font-size: 0.5rem;
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
  border-radius: 0.25rem;
  border: 1px solid ${props => props.bordercolor || colors.gray.sixHundred};
  height: ${props => props.height || "30px"};
  background-color: ${colors.white};
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
  height: ${props => props.height || "1px"};
  transition: background-color 0.2s;
  width: ${props => props.width || "1px"};
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
    dotRadius: 0.6,
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
    dotRadius: 0.1,
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
    dotRadius: 0.6,
    rows: 42,
    columns: 25,
    marginTop: 2.229,
    marginBottom: 0,
    marginLeft: 0.6375,
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
    dotRadius: 0.6,
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
    spacing: 5,
    opacity: 1,
    thickness: 0.175,
    hexagonRadius: 5,
    rows: 29,
    columns: 14,
    marginTop: -5,
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
      <PageOutline className="page-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" style={{marginTop:"4px"}}>
          <polygon points="30.1,84.5 10.2,50 30.1,15.5 69.9,15.5 89.8,50 69.9,84.5" fill="#fff" stroke="#757575" strokeWidth="6"/>
        </svg>
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
    </>
  )
}

export default PageIcons
