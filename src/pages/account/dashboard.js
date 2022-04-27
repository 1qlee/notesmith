import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import Dashboard from "../../components/auth/Dashboard"

function DashboardPage() {
  return <PrivateRoute component={Dashboard} />
}

export default DashboardPage
