import React from "react"
import { ToastContainer, Flip } from 'react-toastify'
import { fonts } from "../../styles/variables"

export default function Toastify() {
  return (
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
      position="top-center"
      rtl={false}
      theme="colored"
      transition={Flip}
      style={{
        fontFamily: fonts.secondary,
        fontSize: "0.75rem",
      }}
    />
  )
}