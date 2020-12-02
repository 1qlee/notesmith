import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { user } = useFirebaseContext()
  const isBrowser = typeof window !== "undefined"

  if (isBrowser && !user && location.pathname !== `/login`) {
    // If we’re not logged in, redirect to the login page.
    navigate(`/login`, { replace: true })
    console.log("Redirecting away...")
    return null
  }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute
