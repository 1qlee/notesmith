import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext, isBrowser } from "../../utils/auth"

const AdminRoute = ({ component: Component, location, ...rest }) => {
  const { user, loading } = useFirebaseContext()

  if (loading) {
    return null
  }
  else {
    if (isBrowser() && user.email !== process.env.GATSBY_ADMIN_EMAIL) {
      // If we’re not logged in, redirect to the login page.
      return navigate(`/404`, { replace: true })
    }
  }

  return <Component {...rest} />
}

export default AdminRoute
