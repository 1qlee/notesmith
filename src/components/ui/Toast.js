import React from "react"
import { colors, fonts } from "../../styles/variables"
import { Toaster } from "react-hot-toast"

const Toast = () => {
  return (
    <Toaster 
      position="bottom-center"
      toastOptions={{
        // Define default options
        className: '',
        duration: 3000,
        iconTheme: {
          primary: "black",
        },
        style: {
          border: colors.borders.black,
          borderRadius: "8px",
          boxShadow: colors.shadow.layeredLarge,
          background: colors.white,
          color: colors.gray.nineHundred,
          fontFamily: fonts.text,
          fontSize: "0.875rem",
        },

        // Default options for specific types
        success: {
          iconTheme: {
            primary: colors.green.sixHundred,
          },
          theme: {
            primary: colors.green.sixHundred,
            secondary: 'black',
          },
        },
        error: {
          iconTheme: {
            primary: colors.red.sixHundred,
          },
          theme: {
            primary: colors.red.sixHundred,
            secondary: 'black',
          },
        },
      }}
    />
  )
}

export default Toast