import React, { useState } from "react"
import Layout from "../layout/Layout"
import { useFirebaseContext } from "../../utils/auth"
import { colors } from "../../styles/variables"
import { WarningCircle } from "phosphor-react"

import SettingsForm from "../form/SettingsForm"
import Icon from "../ui/Icon"
import Button from "../ui/Button"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import Notification from "../ui/Notification"

const UserSettings = () => {
  const { user, sendEmailVerification } = useFirebaseContext()
  const [verificationEmailSent, setVerificationEmailSent] = useState()
  const [notification, setNotification] = useState({
    msg: user.emailVerified ? "" : "Please verify your email address! Check your email for a verification link.",
    backgroundcolor: colors.yellow.oneHundred,
    color: colors.yellow.sevenHundred,
  })

  return (
    <Layout>
      <AuthLayout page="Settings">
        {notification.msg && (
          <Notification color={notification.color} backgroundcolor={notification.backgroundcolor}>
            <Icon>
              <WarningCircle size="2rem" weight="duotone" color={notification.color} />
            </Icon>
            <Content>
              <p>{notification.msg}</p>
            </Content>
            <Button
              backgroundcolor={verificationEmailSent ? colors.green.sixHundred : notification.color}
              color={verificationEmailSent ? colors.white : notification.backgroundcolor}
              onClick={() => sendEmailVerification(setVerificationEmailSent)}
            >
              {verificationEmailSent ? `Email sent!` : `Resend email`}
            </Button>
          </Notification>
        )}
        <SettingsForm />
      </AuthLayout>
    </Layout>
  )
}

export default UserSettings
