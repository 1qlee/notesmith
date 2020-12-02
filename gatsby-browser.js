import React from "react"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import { FirebaseProvider } from "./src/utils/auth"

export const wrapRootElement = ({ element, props }) => {
  return (
    <FirebaseProvider {...props}>{element}</FirebaseProvider>
  )
}
