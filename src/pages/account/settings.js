import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import Settings from "../../components/auth/Settings"

function SettingsPage() {
  return <PrivateRoute component={Settings} />
}

export default SettingsPage
