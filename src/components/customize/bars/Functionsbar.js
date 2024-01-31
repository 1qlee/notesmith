import React from "react"

import { Flexbox } from "../../layout/Flexbox"
import ToolBox from "../boxes/ToolBox"
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
      justify="space-between"
    >
      <ToolBox />
      <TitleBox
        bookData={bookData}
        setBookData={setBookData}
        bookId={bookId}
        toast={toast}
      />
      <div></div>
    </Flexbox>
  )
}

export default Functionsbar
