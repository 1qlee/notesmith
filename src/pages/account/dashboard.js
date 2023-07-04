import React from "react"
import PrivateRoute from "../../components/auth/PrivateRoute"
import AuthDashboard from "../../components/auth/AuthDashboard"

import Seo from "../../components/layout/Seo"

function DashboardPage() {
  return <PrivateRoute component={AuthDashboard} />
}

export default DashboardPage

export const Head = () => (
  <Seo title="Account dashboard" />
)
