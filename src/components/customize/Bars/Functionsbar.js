import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { ToastContainer, toast } from 'react-toastify'

import { Flexbox } from "../../layout/Flexbox"
import TitleBox from "../barComponents/TitleBox"
import Toolbox from "../barComponents/Toolbox"

const StyledFunctionsBar = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${colors.gray.threeHundred};
`

function Functionsbar({
  selectedPage,
  setSelectedPage,
  bookData,
  setBookData,
  bookId,
  children
}) {

  return (
    <StyledFunctionsBar>
      <Toolbox
        toast={toast}
      />
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
        <p>Filler</p>
      </Flexbox>
      <ToastContainer
        autoClose={3000}
        closeOnClick
        draggable
        draggablePercent={50}
        hideProgressBar={false}
        limit={3}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-center"
        rtl={false}
        theme="colored"
        style={{
          fontFamily: "Inter, Helvetica, Tahoma, sans-serif",
          fontSize: "0.75rem",
        }}
      />
    </StyledFunctionsBar>
  )
}

export default Functionsbar
