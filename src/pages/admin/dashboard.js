import React from "react"
import AdminRoute from "../../components/admin/AdminRoute"
import AuthDashboard from "../../components/admin/AdminDashboard"
import Seo from "../../components/layout/Seo"

function AdminDashboardPage() {
  return <AdminRoute component={AuthDashboard} />
}

export default AdminDashboardPage