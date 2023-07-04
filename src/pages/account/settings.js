import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthSettings from "../../components/auth/AuthSettings"

import Seo from "../../components/layout/Seo"

function SettingsPage() {
  return <PrivateRoute component={AuthSettings} />
}

export default SettingsPage

export const Head = () => (
  <Seo title="Account settings" />
)