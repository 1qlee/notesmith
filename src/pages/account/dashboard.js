import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import UserDashboard from "../../components/auth/UserDashboard"

function DashboardPage() {
  return <PrivateRoute component={UserDashboard} />
}

export default DashboardPage
