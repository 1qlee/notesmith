import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import Books from "../../components/auth/Books"

function BooksPage() {
  return <PrivateRoute component={Books} />
}

export default BooksPage
