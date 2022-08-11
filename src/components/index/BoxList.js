import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Content from "../Content"
import Icon from "../Icon"
import { Cards, FrameCorners, Book, File, Spiral, ArrowRight } from "phosphor-react"
import { Flexbox } from "../layout/Flexbox"

const StyledBoxList = styled.div`
  padding: ${props => props.padding};
  width: ${props => props.width};
  margin: ${props => props.margin};
  box-shadow: 6px 6px 0 ${colors.gray.threeHundred};
  border: 2px solid ${colors.gray.nineHundred};
`

const BoxListItem = styled.div`
  background-color: ${colors.white};
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  h5, p {
    color: ${colors.gray.nineHundred};
  }
  &:not(:last-child) {
    border-bottom: 2px solid ${colors.gray.nineHundred};
  }
  &.is-active {
    &::after {
      width: calc(100% - 48px);
      opacity: 1;
      transform: translateX(4px);
    }
    .boxlist-icon {
      background-color: ${colors.yellow.fourHundred};
      svg {
        fill: ${colors.yellow.sixHundred};
        stroke: ${colors.yellow.sixHundred};
      }
    }
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -4px;
    width: 4px;
    height: 100%;
    background: linear-gradient(0deg, ${colors.yellow.threeHundred} 0%, ${colors.yellow.twoHundred} 60%);
    transition: width 0.2s ease-in, opacity 0.2s, transform 0.2s;
    opacity: 0;
    z-index: -1;
  }
  &:hover {
    cursor: pointer;
    &::after {
      opacity: 1;
      transform: translateX(4px);
    }
    &:not(.is-active) {
      .boxlist-arrow {
        opacity: 0.5;
        transform: translateX(0);
      }
    }
  }
`

const BoxListContent = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.margin};
  padding: ${props => props.padding || "0 1rem"};
  height: ${props => props.height};
  flex: 1;
`

const BoxListIcon = styled(Icon)`
  opacity: 0;
  width: 48px;
  justify-content: center;
  transition: opacity 0.2s, transform 0.2s;;
  transform: translateX(-8px);
  &.is-active {
    opacity: 1;
    transform: translateX(0);
  }
`

function BoxList({
  width,
  margin,
  padding,
}) {
  const [activeItem, setActiveItem] = useState()

  return (
    <StyledBoxList
      width={width}
      margin={margin}
      padding={padding}
    >
      <BoxListItem
        onClick={() => setActiveItem(0)}
        className={activeItem === 0 && "is-active"}
      >
        <BoxListContent>
          <Icon
            padding="0.5rem"
            borderradius="100%"
            className="boxlist-icon"
            backgroundcolor={colors.gray.nineHundred}
          >
            <Cards size="1.5rem" color={colors.gray.oneHundred} weight="fill" />
          </Icon>
          <Content
            h5fontsize="0.875rem"
            h5margin="0 0 0.25rem 0"
            padding="1rem"
          >
            <h5>Pages</h5>
            <p>70 sheets total (140 pages)</p>
          </Content>
        </BoxListContent>
        <BoxListIcon
          className={activeItem === 0 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveItem(1)}
        className={activeItem === 1 && "is-active"}
      >
        <BoxListContent>
          <Icon
            padding="0.5rem"
            className="boxlist-icon"
            backgroundcolor={colors.gray.nineHundred}
            borderradius="100%"
          >
            <FrameCorners size="1.5rem" color={colors.gray.oneHundred} weight="fill" />
          </Icon>
          <Content
            h5fontsize="0.875rem"
            h5margin="0 0 0.25rem 0"
            padding="1rem"
          >
            <h5>Size</h5>
            <p>5.5" x 8.5" (A5)</p>
          </Content>
        </BoxListContent>
        <BoxListIcon
          className={activeItem === 1 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveItem(2)}
        className={activeItem === 2 && "is-active"}
      >
        <BoxListContent>
          <Icon
            padding="0.5rem"
            className="boxlist-icon"
            backgroundcolor={colors.gray.nineHundred}
            borderradius="100%"
          >
            <Book size="1.5rem" color={colors.gray.oneHundred} weight="fill" />
          </Icon>
          <Content
            h5fontsize="0.875rem"
            h5margin="0 0 0.25rem 0"
            padding="1rem"
          >
            <h5>Cover</h5>
            <p>Sand matte laminated, extra thick</p>
          </Content>
        </BoxListContent>
        <BoxListIcon
          className={activeItem === 2 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveItem(3)}
        className={activeItem === 3 && "is-active"}
      >
        <BoxListContent>
          <Icon
            padding="0.5rem"
            className="boxlist-icon"
            backgroundcolor={colors.gray.nineHundred}
            borderradius="100%"
          >
            <File size="1.5rem" color={colors.gray.oneHundred} weight="fill" />
          </Icon>
          <Content
            h5fontsize="0.875rem"
            h5margin="0 0 0.25rem 0"
            padding="1rem"
          >
            <h5>Paper</h5>
            <p>70lb ultra-smooth, bright white</p>
          </Content>
        </BoxListContent>
        <BoxListIcon
          className={activeItem === 3 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveItem(4)}
        className={activeItem === 4 && "is-active"}
      >
        <BoxListContent>
          <Icon
            padding="0.5rem"
            className="boxlist-icon"
            backgroundcolor={colors.gray.nineHundred}
            borderradius="100%"
          >
            <Spiral size="1.5rem" color={colors.gray.oneHundred} weight="fill" />
          </Icon>
          <Content
            h5fontsize="0.875rem"
            h5margin="0 0 0.25rem 0"
            padding="1rem"
          >
            <h5>Binding</h5>
            <p>Gold colored wire-o</p>
          </Content>
        </BoxListContent>
        <BoxListIcon
          className={activeItem === 4 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
    </StyledBoxList>
  )
}

export { BoxList, StyledBoxList }