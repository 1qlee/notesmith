import React from "react"

import Invite from "../../components/auth/invites/Invite"
import Seo from "../../components/layout/Seo"

const InvitesPage = ({ params, location }) => {
  return (
    <Invite
      inviteId={params.inviteId}
      location={location}
    />
  )
}

export default InvitesPage

export const Head = () => (
  <Seo title="You've been invited to join Notesmith's early access!" />
)