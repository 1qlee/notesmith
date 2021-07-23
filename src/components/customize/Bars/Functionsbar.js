import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"

const PageInput = styled.input`
  width: 50px;
  border: 1px solid ${colors.gray.sixHundred};
  border-radius: 0.25rem;
  text-align: center;
  padding: 0.25rem;
  margin-right: 0.25rem;
`

function Functionsbar({
  selectedPage,
  setSelectedPage,
  totalPages
}) {

  function handlePageChange(value) {
    if (value > totalPages) {
      setSelectedPage(totalPages)
    }
    else if (value < 1) {
      setSelectedPage(1)
    }
    else {
      setSelectedPage(parseInt(value))
    }
  }

  return (
    <Flexbox
      flex="flex"
      padding="1rem 0"
      justifycontent="space-between"
      alignitems="center"
      height="4rem"
    >
      <Flexbox
        flex="flex"
        alignitems="center"
      >

      </Flexbox>
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="center"
      >
        <p style={{marginRight: "0.25rem"}}>Page</p>
        <PageInput
          type="number"
          min="1"
          max={totalPages}
          value={selectedPage}
          onChange={e => handlePageChange(e.target.value)}
        />
        <p>of {totalPages}</p>
      </Flexbox>
      <Flexbox
        flex="flex"
        alignitems="center"
      >

      </Flexbox>
    </Flexbox>
  )
}

export default Functionsbar
