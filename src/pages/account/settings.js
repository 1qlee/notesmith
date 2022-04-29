import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import UserSettings from "../../components/auth/UserSettings"

function SettingsPage() {
  return <PrivateRoute component={UserSettings} />
}

export default SettingsPage
