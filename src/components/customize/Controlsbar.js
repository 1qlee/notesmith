import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import Line from "../../assets/customize/line.svg"

import Icon from "../Icon"
import Button from "../Button"
import { Flexbox } from "../layout/Flexbox"

const StyledControlsbar = styled.div`
  position: absolute;
  right: 0;
  height: calc(100% - 6rem);
  width: 300px;
`

function Controlsbar({
  quantity,
  selectedPage
}) {
  return (
    <StyledControlsbar>
      <h1>Quantity: {quantity}</h1>
      <h3>Active Page: {selectedPage}</h3>
    </StyledControlsbar>
  )
}

export default Controlsbar
