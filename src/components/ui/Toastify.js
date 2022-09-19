import React from "react"
import { ToastContainer } from 'react-toastify'
import { fonts } from "../../styles/variables"

export default function Toastify() {
  return (
    <ToastContainer
      autoClose={3000}
      closeOnClick
      draggable
      draggablePercent={50}
      hideProgressBar={false}
      icon={false}
      limit={3}
      newestOnTop={false}
      pauseOnFocusLoss
      pauseOnHover
      position="bottom-center"
      rtl={false}
      theme="dark"
      style={{
        fontFamily: fonts.secondary,
        fontSize: "0.75rem",
      }}
    />
  )
}