import React, { useState } from "react"
import Layout from "../layout/Layout"
import { useFirebaseContext } from "../../utils/auth"
import { colors, spacing, widths } from "../../styles/variables"
import { WarningCircle } from "phosphor-react"

import { SectionMain, SectionApp, SectionAppContent } from "../layout/Section"
import { Grid, Cell } from "styled-css-grid"
import { Flexbox, FlexboxButtons } from "../layout/Flexbox"
import SettingsForm from "../form/SettingsForm"
import Icon from "../Icon"
import Button from "../Button"
import Content from "../Content"
import SEO from "../layout/Seo"
import Sidebar from "../ui/Sidebar"
import Notification from "../ui/Notification"

const Settings = () => {
  const { user, sendEmailVerification } = useFirebaseContext()
  const [verificationEmailSent, setVerificationEmailSent] = useState()
  const [notification, setNotification] = useState({
    msg: user.emailVerified ? "" : "Please verify your email address! Check your email for a verification link.",
    backgroundcolor: colors.yellow.oneHundred,
    color: colors.yellow.sevenHundred,
  })

  return (
    <Layout>
      <SEO title="Settings" />
      <SectionMain className="has-no-padding has-max-height">
        <SectionApp>
          <Sidebar />
          <SectionAppContent>
            <Grid
              flow="row"
              rowGap={spacing.normal}
              columns={`minmax(100px, ${widths.tablet})`}
              rows="auto"
            >
              <Cell>
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
              </Cell>
            </Grid>
          </SectionAppContent>
        </SectionApp>
      </SectionMain>
    </Layout>
  )
}

export default Settings
