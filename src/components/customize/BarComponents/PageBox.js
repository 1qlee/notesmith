import React, { useState, useRef } from "react"
import styled from "styled-components"

import { StyledInput } from "../../form/FormComponents"

const StyledPageBox = styled.div`
  width: auto;
`

function PageBox() {
  return (
    <StyledPageBox>
      <p>Page</p>
      <StyledInput
        type="number"
        min="1"
        width="3rem"
        padding="0.25rem"
        textalign="center"
        margin="0 0.25rem"
        max={bookData.numOfPages}
        value={selectedPage}
        onChange={e => handlePageChange(e.target.value)}
      />
      <p>of {bookData.numOfPages}</p>
    </StyledPageBox>
  )
}

export default PageBox
