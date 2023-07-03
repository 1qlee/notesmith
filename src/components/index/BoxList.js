import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import Icon from "../ui/Icon"
import { ArrowRight } from "phosphor-react"
import { Flexbox } from "../layout/Flexbox"

const StyledBoxList = styled.div`
  padding: ${props => props.padding};
  width: ${props => props.width};
  margin: ${props => props.margin};
`

const BoxListItem = styled.div`
  background-color: ${colors.white};
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  border-bottom: 2px solid ${colors.gray.nineHundred};
  &.is-active {
    padding: 0 32px;
    h3, p {
      color: ${colors.gray.oneHundred};
    }
    &::after {
      width: 100%;
      opacity: 1;
      transform: translateX(4px);
    }
    .boxlist-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -4px;
    width: 4px;
    height: 100%;
    background: ${colors.gray.nineHundred};
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
      .boxlist-content {
        padding-left: 2rem;
      }
    }
  }
`

const BoxListContent = styled.div`
  margin: ${props => props.margin};
  padding: ${props => props.padding || "0 1rem"};
  height: ${props => props.height};
  padding: 1rem 0;
  flex: 1;
  transition: transform 0.2s, padding 0.2s;
  h3 {
    font-size: 2rem;
    font-weight: 400;
  }
  h3, p {
    color: ${colors.gray.nineHundred};
  }
  p {
    line-height: 1.5;
  }
  &.is-active {
    padding: 1rem;
  }
`

const BoxListIcon = styled(Icon)`
  opacity: 0;
  width: 48px;
  justify-content: center;
  transition: opacity 0.2s, transform 0.2s;;
  transform: translateX(-8px);
  z-index: 1;
  &.is-active {
    opacity: 1;
    transform: translateX(0);
    svg {
      fill: ${colors.gray.oneHundred};
    }
  }
`

function BoxListImages({
  activeImage,
}) {
  return (
    <div></div>
  )
}

function BoxList({
  width,
  margin,
  padding,
  activeImage,
  setActiveImage,
}) {
  return (
    <StyledBoxList
      width={width}
      margin={margin}
      padding={padding}
    >
      <BoxListItem
        onClick={() => setActiveImage(0)}
        className={activeImage === 0 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-between"
            margin="0 0 16px"
          >
            <h3>Paper</h3>
            <BoxListIcon
              className={activeImage === 3 ? "is-active boxlist-arrow" : "boxlist-arrow"}
            >
              <ArrowRight size="1.5rem" />
            </BoxListIcon>
          </Flexbox>
          <p>There are 70 sheets (140 total pages) of ultra-smooth, bright white 70lb text paper.</p>
        </BoxListContent>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(2)}
        className={activeImage === 2 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-between"
            margin="0 0 16px"
          >
            <h3>Cover</h3>
            <BoxListIcon
              className={activeImage === 2 ? "is-active boxlist-arrow" : "boxlist-arrow"}
            >
              <ArrowRight size="1.5rem" />
            </BoxListIcon>
          </Flexbox>
          <p>130lb cover stock that has been double mounted for extra thickness and durability.</p>
        </BoxListContent>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(3)}
        className={activeImage === 3 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-between"
            margin="0 0 16px"
          >
            <h3>Lamination</h3>
            <BoxListIcon
              className={activeImage === 3 ? "is-active boxlist-arrow" : "boxlist-arrow"}
            >
              <ArrowRight size="1.5rem" />
            </BoxListIcon>
          </Flexbox>
          <p>Sand-matte textured lamination film (water-resistant) on the outside of both covers.</p>
        </BoxListContent>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(4)}
        className={activeImage === 4 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <Flexbox
            flex="flex"
            alignitems="center"
            justifycontent="space-between"
            margin="0 0 16px"
          >
            <h3>Binding</h3>
            <BoxListIcon
              className={activeImage === 4 ? "is-active boxlist-arrow" : "boxlist-arrow"}
            >
              <ArrowRight size="1.5rem" />
            </BoxListIcon>
          </Flexbox>
          <p>Gold colored wire-o</p>
        </BoxListContent>
      </BoxListItem>
    </StyledBoxList>
  )
}

export { BoxList, StyledBoxList, BoxListImages }