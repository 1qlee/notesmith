import React, { useState } from "react"
import { colors, widths } from "../../../styles/variables"
import { WarningCircle, CircleNotch } from "@phosphor-icons/react"
import validatePassword from "../../../functions/validatePassword"
import { set, get, ref } from "firebase/database"
import sendEmailVerification from "../../../functions/sendEmailVerification"
import { useFirebaseContext } from "../../../utils/auth"

import Layout from "../../layout/Layout"
import { SectionMain, Section, SectionContent } from "../../layout/Section"
import { StyledInput, StyledLabel, StyledFieldset, ErrorLine } from "../../form/FormComponents"
import Content from "../../ui/Content"
import Box from "../../ui/Box"
import Button from "../../ui/Button"
import Icon from "../../ui/Icon"

const Invite = ({ inviteId, location }) => {
  const { firebaseDb, signUp } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(null)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(null)
  const [passwordValidated, setPasswordValidated] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    // check if this refferal code was already used
    get(ref(firebaseDb, `referrals/${inviteId}`)).then((snapshot) => {
      // if the referral code exists
      if (snapshot.exists()) {
        const referral = snapshot.val()
        setEmailError(null)

        // if the code was already redeemed
        if (referral.redeemed) {
          setEmailError("This referral code has already been used.")
          setLoading(false)
        }
        else {
          signUp(email, password).then(async userObject => {
            const { user } = userObject

            // Record new user in the db
            await set(ref(firebaseDb, 'users/' + user.uid), {
              dateCreated: new Date().valueOf(),
              earlyAccess: true,
              email: user.email,
              id: user.uid,
              referrer: false,
            })

            return user
          }).then(async user => {
            // Send the user a verification email
            await sendEmailVerification(user.email)
            setLoading(false)
          }).catch(error => {
            setLoading(false)

            switch (error.code) {
              case "auth/email-already-in-use":
                setEmailError("This email is already in use.")
                break
              case "auth/invalid-email":
                setEmailError("Email was in an invalid format.")
                break
              case "auth/operation-not-allowed":
                setEmailError("Sorry, our server is busy.")
                break
              default:
                setEmailError("Something went wrong.")
            }
          })
        }
      }
      else {
        setEmailError("This referral code does not exist or it has already been redeemed.")
        setLoading(false)
      }
    })
  }

  function handlePasswordOnChange(password) {
    const { isValid, error } = validatePassword(password)

    if (isValid) {
      setPasswordValidated(true)
      setPasswordError(null)
      setPassword(password)
    }
    else {
      setPasswordError(error)
      setPasswordValidated(false)
    }
  }

  function handlePasswordOnBlur(password) {
    if (password.length === 0) {
      setPasswordError(null)
      setPasswordValidated(false)
    }
  }

  return (
    <Layout
      title="Sign up for an account"
      className="is-full-height"
    >
      <SectionMain
        className="has-max-height"
      >
        <Section>
          <SectionContent padding="0">
            <Box
              className="has-border no-border-top"
              margin="0 auto 64px"
              width={widths.form}
              padding="64px"
            >
              <Content
                h1fontsize="2rem"
                margin="0 0 32px"
              >
                <h1>You've been invited to join early access!</h1>
                <p>We're thrilled to have you on board as one of our valued pioneers, getting a sneak peek into the exciting platform we're building. Your feedback and insights will play a crucial role in shaping what's to come.</p>
                <p>Additionally, enjoy 20% off notebooks and free shipping (to the U.S. only) during our pre-order period lasting until mid-November.</p>
              </Content>
              <form
                id="signup-form"
                onSubmit={e => handleSubmit(e)}
              >
                <StyledFieldset
                  margin="0 0 16px"
                >
                  <StyledLabel>Email</StyledLabel>
                  <StyledInput
                    onChange={e => setEmail(e.currentTarget.value)}
                    onFocus={() => setEmailError(null)}
                    className={emailError && "is-error"}
                    fontsize="1rem"
                    id="email"
                    type="email"
                    name="email"
                    autocomplete="email"
                  />
                  {emailError && (
                    <ErrorLine color={colors.red.sixHundred}>
                      <Icon>
                        <WarningCircle weight="fill" color={colors.red.sixHundred} size={16} />
                      </Icon>
                      <span>{emailError}</span>
                    </ErrorLine>
                  )}
                </StyledFieldset>
                <StyledFieldset
                  margin="0 0 32px"
                >
                  <StyledLabel>Password (min. 8 characters)</StyledLabel>
                  <StyledInput
                    onChange={(e) => handlePasswordOnChange(e.currentTarget.value)}
                    onBlur={(e) => handlePasswordOnBlur(e.currentTarget.value)}
                    className={passwordError && "is-error"}
                    fontsize="1rem"
                    id="password"
                    type="password"
                    name="password"
                    autocomplete="new-password"
                  />
                  {passwordValidated && (
                    <div style={{ position: `absolute`, right: `1rem`, bottom: `0` }}>
                      <Icon
                        icon="ShieldCheck"
                        weight="regular"
                        size="1.5rem"
                        color={colors.green.sixHundred}
                      />
                    </div>
                  )}
                  {passwordError && (
                    <ErrorLine color={colors.red.sixHundred}>
                      <Icon>
                        <WarningCircle weight="fill" color={colors.red.sixHundred} size={16} />
                      </Icon>
                      <span>{passwordError}</span>
                    </ErrorLine>
                  )}
                </StyledFieldset>
                <StyledFieldset>
                  <Button
                    backgroundcolor={colors.gray.nineHundred}
                    className={loading && "is-loading"}
                    color={colors.gray.oneHundred}
                    disabled={!passwordValidated || !email || loading}
                    form="signup-form"
                    padding="16px"
                    type="submit"
                    width="100%"
                  >
                    {loading ? (
                      <Icon>
                        <CircleNotch size="1rem" />
                      </Icon>
                    ) : (
                      <span>Create account</span>
                    )}
                  </Button>
                </StyledFieldset>
              </form>
            </Box>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Invite