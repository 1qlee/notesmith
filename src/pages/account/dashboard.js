import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthDashboard from "../../components/auth/AuthDashboard"

function DashboardPage() {
  return <PrivateRoute component={AuthDashboard} />
}

export default DashboardPage
