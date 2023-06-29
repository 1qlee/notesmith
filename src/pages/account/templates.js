import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthTemplates from "../../components/auth/AuthTemplates"

function TemplatesPage() {
  return <PrivateRoute component={AuthTemplates} />
}

export default TemplatesPage
