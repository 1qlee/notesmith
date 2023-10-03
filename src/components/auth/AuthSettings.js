import React, { useState } from "react"
import Layout from "../layout/Layout"
import { useFirebaseContext } from "../../utils/auth"
import { colors } from "../../styles/variables"
import { WarningCircle } from "@phosphor-icons/react"

import Loader from "../misc/Loader"
import SettingsForm from "../form/SettingsForm"
import Icon from "../ui/Icon"
import Button from "../ui/Button"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import Notification from "../ui/Notification"

const UserSettings = () => {
  const { loading, user, sendEmailVerification } = useFirebaseContext()
  const [verificationEmailSent, setVerificationEmailSent] = useState()

  if (loading || !user) {
    return <Loader />
  }
  else {
    return (
      <Layout>
        <AuthLayout page="Settings">
          {!user.emailVerified && (
            <Notification 
              color={colors.yellow.nineHundred} 
              backgroundcolor={colors.yellow.twoHundred}
              margin="32px 0"
              alignitems="center"
            >
              <Icon>
                <WarningCircle size="24px" weight="duotone" color={colors.yellow.nineHundred} />
              </Icon>
              <Content>
                <p>Please verify your email address! Check your email for a verification link.</p>
              </Content>
              <Button
                backgroundcolor={verificationEmailSent ? colors.green.sixHundred : colors.yellow.twoHundred}
                color={verificationEmailSent ? colors.green. nineHundred : colors.yellow.nineHundred}
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
}

export default UserSettings
