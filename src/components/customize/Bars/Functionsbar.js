import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput } from "../../form/FormComponents"
import TitleBox from "../barComponents/TitleBox"
import Toolbox from "../barComponents/Toolbox"

const PageInput = styled.input`
  border-radius: 0.25rem;
  border: 1px solid ${colors.gray.sixHundred};
  margin-right: 0.25rem;
  padding: 0.25rem;
  text-align: center;
  width: 50px;
  z-index: 9;
`

function Functionsbar({
  selectedPage,
  setSelectedPage,
  bookData,
  setBookData,
  bookId,
  children
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
    <Flexbox
      flex="flex"
      width="100%"
      className="has-border-bottom"
      bordercolor={colors.gray.threeHundred}
    >
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
    </Flexbox>
  )
}

export default Functionsbar
