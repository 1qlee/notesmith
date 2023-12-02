import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthSettings from "../../components/auth/AuthSettings"

function SettingsPage() {
  return <PrivateRoute component={AuthSettings} />
}

export default SettingsPage