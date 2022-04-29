import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import UserBooks from "../../components/auth/UserBooks"

function BooksPage() {
  return <PrivateRoute component={UserBooks} />
}

export default BooksPage
