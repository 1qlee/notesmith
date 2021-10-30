import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput } from "../../form/FormComponents"
import TitleBox from "../BarComponents/TitleBox"

const StyledFunctionsBar = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding: 1rem 0;
  width: 100%;
`

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
  bookData,
  setBookData,
  bookId,
}) {
  const [showTitleInput, setShowTitleInput] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState("")

  function handlePageChange(value) {
    if (value > bookData.numOfPages) {
      setSelectedPage(bookData.numOfPages)
    }
    else if (value < 1) {
      setSelectedPage(1)
    }
    else {
      setSelectedPage(parseInt(value))
    }
  }

  return (
    <StyledFunctionsBar>
      <TitleBox
        bookData={bookData}
        setBookData={setBookData}
        bookId={bookId}
      />
      <Flexbox
        flex="flex"
        alignitems="center"
      >

      </Flexbox>
    </StyledFunctionsBar>
  )
}

export default Functionsbar
