import React from "react"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"

const AdminRoute = ({ component: Component, location, ...rest }) => {
  const isBrowser = typeof window !== "undefined"
  const { user, loading } = useFirebaseContext()

  if (loading) {
    return null
  }
  if (isBrowser && user.email !== process.env.GATSBY_ADMIN_EMAIL) {
    // If we’re not logged in, redirect to the login page.
    return navigate(`/404`, { replace: true })
  }

  return <Component {...rest} />
}

export default AdminRoute
