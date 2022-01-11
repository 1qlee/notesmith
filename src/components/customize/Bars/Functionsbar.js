import React, { useState } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput } from "../../form/FormComponents"
import TitleBox from "../BarComponents/TitleBox"
import Toolbox from "../BarComponents/Toolbox"

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
