import React from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

import { Flexbox } from "../../layout/Flexbox"
import TitleBox from "../barComponents/TitleBox"
import Toolbox from "../barComponents/Toolbox"

const StyledFunctionsBar = styled.div`
  display: flex;
  width: 100%;
  border-bottom: ${colors.borders.black};
`

function Functionsbar({
  bookData,
  setBookData,
  bookId,
  toast,
}) {

  return (
    <StyledFunctionsBar>
      <Toolbox />
      <TitleBox
        bookData={bookData}
        setBookData={setBookData}
        bookId={bookId}
        toast={toast}
      />
      <Flexbox
        flexprop="1 1 33%"
        flex="flex"
        justifycontent="flex-end"
        alignitems="center"
      >
      </Flexbox>
    </StyledFunctionsBar>
  )
}

export default Functionsbar
