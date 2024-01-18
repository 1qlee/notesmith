import React from "react"

import { Flexbox } from "../../layout/Flexbox"
import TitleBox from "../boxes/TitleBox"

function Functionsbar({
  bookData,
  setBookData,
  bookId,
  toast,
}) {

  return (
    <Flexbox
      className="has-border-bottom"
      justify="center"
    >
      <TitleBox
        bookData={bookData}
        setBookData={setBookData}
        bookId={bookId}
        toast={toast}
      />
    </Flexbox>
  )
}

export default Functionsbar
