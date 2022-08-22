import React from "react"
import styled from "styled-components"
import { colors, fonts } from "../../styles/variables"
import Icon from "../Icon"
import { ArrowRight } from "phosphor-react"

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
  border-top: 2px solid ${colors.gray.nineHundred};
  z-index: 1;
  &.is-active {
    h5, p {
      color: ${colors.gray.oneHundred};
    }
    &::after {
      width: calc(100% - 48px);
      opacity: 1;
      transform: translateX(4px);
    }
    .boxlist-content {
      transform: translateX(2rem);
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
        transform: translateX(2rem);
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
  h5 {
    font-family: ${fonts.secondary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  h5, p {
    color: ${colors.gray.nineHundred};
  }
  &.is-active {
    padding: 1rem;
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
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
          <h5>Pages</h5>
          <p>70 sheets total (140 pages)</p>
        </BoxListContent>
        <BoxListIcon
          className={activeImage === 0 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(1)}
        className={activeImage === 1 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <h5>Size</h5>
          <p>5.5" x 8.5" (A5)</p>
        </BoxListContent>
        <BoxListIcon
          className={activeImage === 1 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(2)}
        className={activeImage === 2 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <h5>Cover</h5>
          <p>Sand matte laminated, extra thick</p>
        </BoxListContent>
        <BoxListIcon
          className={activeImage === 2 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(3)}
        className={activeImage === 3 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <h5>Paper</h5>
          <p>70lb ultra-smooth, bright white</p>
        </BoxListContent>
        <BoxListIcon
          className={activeImage === 3 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
      <BoxListItem
        onClick={() => setActiveImage(4)}
        className={activeImage === 4 && "is-active"}
      >
        <BoxListContent
          className="boxlist-content"
        >
          <h5>Binding</h5>
          <p>Gold colored wire-o</p>
        </BoxListContent>
        <BoxListIcon
          className={activeImage === 4 ? "is-active boxlist-arrow" : "boxlist-arrow"}
        >
          <ArrowRight size="1.5rem" />
        </BoxListIcon>
      </BoxListItem>
    </StyledBoxList>
  )
}

export { BoxList, StyledBoxList, BoxListImages }