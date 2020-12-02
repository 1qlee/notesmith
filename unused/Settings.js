import React from "react"
import { useAuth0 } from "../utils/auth0Wrapper"

const Settings = ({ user }) => {
  const { getTokenSilently } = useAuth0()
  const accessToken = getTokenSilently()

  const resetPasswordEmail = e => {
    console.log(user.email)
    console.log(accessToken)
    e.preventDefault()
    fetch('https://notesmith.auth0.com/dbconnections/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: {
        client_id: process.env.AUTH0_CLIENTID,
        email: user.email,
        connection: 'Username-Password-Authentication'
      },
      json: true
    }).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <form>
      <button onClick={e => resetPasswordEmail(e)}>Reset Password</button>
      <h1>{user.email}</h1>
      <fieldset>
        <label style={{color:"#fff"}}>Current Password</label>
        <input type="text" />
      </fieldset>
      <fieldset>
        <label style={{color:"#fff"}}>New Password</label>
        <input type="text" />
      </fieldset>
    </form>
  )
}

export default Settings
