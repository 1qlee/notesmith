import React from "react"
import styled from "styled-components"
import { colors } from "../styles/variables"

import Icon from "./Icon"

const StyledHandwriting = styled.div`
  color: ${props => props.color ? props.color : colors.gray.sixHundred };
  display: flex;
  align-items: center;
  justify-content: ${props => props.textAlign ? props.textAlign : "center"};
  font-family: 'Nanum Pen Script';
  margin-top: 1rem;
  font-size: ${props => props.fontSize ? props.fontSize : "1.2rem"};
`

function Handwriting(props) {

  return (
    <StyledHandwriting color={props.color} fontSize={props.fontSize} textAlign={props.textAlign}>
      {props.up ? (
        <Icon height="1rem" width="1rem" icon="CornerLeftUpIcon" />
      ) : (
        null
      )}
      {props.down ? (
        <Icon height="1rem" width="1rem" icon="CornerLeftDownIcon" />
      ) : (
        null
      )}
      <span>
        {props.children}
      </span>
    </StyledHandwriting>
  )
}

export default Handwriting
