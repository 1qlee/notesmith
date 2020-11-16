import React from "react"
import Img from "gatsby-image"
import styled from "styled-components"
import { colors } from "../styles/variables"

const ImageWrapper = styled.figure`
  background-color: ${props => props.caption ? colors.black : null};
  box-shadow: 0 4px 12px ${colors.shadow};
  padding: 0.5rem;
  position: relative;
  text-align: center;
  width: ${props => props.width ? props.width : "100%"};
  caption {
    background-color: ${colors.black};
    bottom: 0;
    color: ${colors.white};
    display: ${props => props.caption ? "block" : "none"};
    font-size: 1rem;
    left: 0;
    text-align: left;
    padding: 0.5rem;
    position: absolute;
    width: 100%;
    p {
      margin-bottom: 0.5rem;
    }
    small {
      font-style: italic;
    }
  }
`

const Tape = styled.div`
  background-color: ${colors.shadow.inset};
  box-shadow: 4px 4px 4px ${colors.shadow.float};
  height: 2rem;
  left: 50%;
  position: absolute;
  top: -0.8rem;
  transform: translateX(-50%) rotate(2deg);
  width: 6rem;
  z-index: 8;
  &::before,
  &::after {
    background-size: 4px 4px;
    bottom: 0;
    content: '';
    position: absolute;
    top: 0;
    width: 3px;
  }
  &::before {
    background-image: linear-gradient(135deg, transparent 40%, ${colors.shadow.inset} 40%);
    background-position: 100% 100%;
    left: -3px;
  }
  &::after {
    background-image: linear-gradient(-135deg, transparent 40%, ${colors.shadow.inset} 40%);
    background-position: 0 100%;
    right: -3px;
  }
`

const Image = (props) => {
  if (props.fluid) {
    return (
      <ImageWrapper caption={props.caption} width={props.width}>
        <Img fluid={props.fluid} />
        <caption>
          <p>{props.title ? props.title : null}</p>
          <small>{props.caption ? props.caption : null}</small>
        </caption>
      </ImageWrapper>
    )
  }
  else if (props.fixed) {
    return (
      <ImageWrapper caption={props.caption} width={props.width}>
        <Img fixed={props.fixed} />
        <caption>
          <p>{props.title ? props.title : null}</p>
          <small>{props.caption ? props.caption : null}</small>
        </caption>
      </ImageWrapper>
    )
  }
  else {
    return null
  }
}

export default Image
