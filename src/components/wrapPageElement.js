import React from "react"
import Layout from "./layout/Layout"
import 'firebase/auth';

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
)
