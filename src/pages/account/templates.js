import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthTemplates from "../../components/auth/AuthTemplates"

import Seo from "../../components/layout/Seo"

function TemplatesPage() {
  return <PrivateRoute component={AuthTemplates} />
}

export default TemplatesPage