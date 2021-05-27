import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"

import { Flexbox } from "../layout/Flexbox"

function Functionsbar() {
  return (
    <Flexbox
      flex="flex"
      padding="1rem 0"
      height="55px"
    >
      <button>Do something</button>
    </Flexbox>
  )
}

export default Functionsbar
