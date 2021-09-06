import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { user, loading } = useFirebaseContext()
  const isBrowser = typeof window !== "undefined"

  if (loading) {
    return null
  }
  if (isBrowser && !user && location.pathname !== `/signin`) {
    // If we’re not logged in, redirect to the login page.
    navigate(`/signin`, { replace: true })
    return null
  }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute
