import React, { useState } from "react"
import Layout from "../layout/Layout"
import { useFirebaseContext } from "../../utils/auth"
import { colors, spacing } from "../../styles/variables"
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
  const [notification, setNotification] = useState({
    msg: user.emailVerified ? "" : "Please verify your email address! Check your email for a verification link.",
    backgroundColor: colors.yellow.oneHundred,
    color: colors.yellow.sevenHundred,
  })

  return (
    <Layout>
      <SEO title={`Settings - ${user.displayName}`} />
      <SectionMain className="has-no-padding has-max-height">
        <SectionApp>
          <Sidebar />
          <SectionAppContent>
            <Grid
              flow="row"
              rowGap={spacing.normal}
              columns="1fr 1fr"
              rows="auto"
            >
              <Cell>
                {notification.msg && (
                  <Notification color={notification.color} backgroundColor={notification.backgroundColor}>
                    <Icon>
                      <WarningCircle size="2rem" weight="duotone" color={notification.color} />
                    </Icon>
                    <Content>
                      <p>{notification.msg}</p>
                    </Content>
                    <Button
                      backgroundColor={notification.color}
                      color={notification.backgroundColor}
                      onClick={sendEmailVerification}
                    >
                      Resend Email
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
