import React, { useEffect, useState } from "react"
import sendEmailVerification from "../../../functions/sendEmailVerification"
import validatePassword from "../../../functions/validatePassword"
import { Link } from "gatsby"
import { WarningCircle, CircleNotch } from "@phosphor-icons/react"
import { colors, widths, marketingLists } from "../../../styles/variables"
import { set, get, ref, update } from "firebase/database"
import { toast } from "react-toastify"
import { useFirebaseContext } from "../../../utils/auth"

import Box from "../../ui/Box"
import Button from "../../ui/Button"
import Content from "../../ui/Content"
import Icon from "../../ui/Icon"
import Layout from "../../layout/Layout"
import Loader from "../../misc/Loader"
import Notification from "../../ui/Notification"
import TextLink from "../../ui/TextLink"
import addEmailToLists from "../../../functions/addEmailToLists"
import { Flexbox } from "../../layout/Flexbox"
import { SectionMain, Section, SectionContent } from "../../layout/Section"
import { StyledInput, StyledLabel, StyledFieldset, ErrorLine } from "../../form/FormComponents"

const Invite = ({ inviteId }) => {
  const { firebaseDb, signUp, loading } = useFirebaseContext()
  const [retrieving, setRetrieving] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(null)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(null)
  const [passwordValidated, setPasswordValidated] = useState()
  const [referralError, setReferralError] = useState({
    status: false,
    text: "",
  })
  const [accountCreated, setAccountCreated] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    // check if this refferal code was already used
    get(ref(firebaseDb, `referrals/${inviteId}`)).then((snapshot) => {
      // if the referral code exists
      if (snapshot.exists()) {
        const referral = snapshot.val()
        setEmailError(null)

        // if the code was already redeemed
        if (referral.redeemed) {
          setEmailError("This referral code has already been used.")
          setSubmitting(false)
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
              referrer: true,
            })

            return user
          }).then(async user => {
            // set the referral code to redeemed
            await update(ref(firebaseDb, `referrals/${inviteId}`), { 
              redeemed: true,
              redeemerId: user.uid,
            })
            // Send the user a verification email
            await sendEmailVerification(user.email)
            await addEmailToLists(user.email, marketingLists)

            toast("Success! Check your email for a verification link.")

            setAccountCreated(true)
            setSubmitting(false)
          }).catch(error => {
            setSubmitting(false)

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
        setSubmitting(false)
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

  useEffect(() => {
    const getReferralCode = async () => {
      if (!loading) {
        get(ref(firebaseDb, `referrals/${inviteId}`)).then((snapshot) => {
          // check if the referral code exists and if it was redeemed
          if (snapshot.exists()) {
            const referral = snapshot.val()
            const { redeemed } = referral

            if (redeemed) {
              setReferralError({
                status: true,
                text: ["This referral code has already been redeemed. Please check again with the person who referred you as they may be able to provide you with a different code.", "If this referral code was the one that you redeemed, please try signing in."],
              })
              setRetrieving(false)
            }
            else {
              setReferralError({
                status: false,
                text: "",
              })
              setRetrieving(false)
            }
          }
          else {
            setReferralError({
              status: true,
              text: ["This referral code does not exist. Please check again with the person who referred you."],
            })
            setRetrieving(false)
          }
        }).catch(err => console.log(err))
      }
    }

    getReferralCode()
  }, [inviteId, loading])

  if (retrieving) {
    return <Loader />
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
            {referralError.status ? (
                <Flexbox
                  flexdirection="column"
                  align="flex-end"
                >
                  <Notification
                    backgroundcolor={colors.red.twoHundred}
                    color={colors.red.nineHundred}
                    margin="0"
                  >
                    <Content>
                      {referralError.text.map((text) => (
                        <p>{text}</p>
                      ))}
                    </Content>
                  </Notification>
                  <Button
                    as={Link}
                    to="/signin"
                    margin="16px 0 0"
                  >
                    Go to sign in
                  </Button>
                </Flexbox>
              ) : (
                <>
                  {accountCreated ? (
                    <Content
                      h1fontsize="2rem"
                      margin="0"
                    >
                      <h1>Welcome to Notesmith!</h1>
                        <p>Congratulations, you've successfully created your early access account! Please check your email in order to verify your account (click the link inside the email we sent you). Then simply <TextLink><Link to="/signin">log in</Link></TextLink> to your account to start creating your first notebook.</p>
                    </Content>
                  ) : (
                    <>
                      <Content
                        h1fontsize="2rem"
                        margin="0 0 32px"
                      >
                        <h1>You've been invited to join early access!</h1>
                        <p>We're thrilled to have you on board as one of our valued pioneers, getting a sneak peek into the exciting platform we're building. Your feedback and insights will play a crucial role in shaping what's to come.</p>
                        <p>Additionally, enjoy <b>20% off</b> notebooks and <b>free shipping</b> (to the U.S. only) during our pre-order period lasting until late-November.</p>
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
                            className={submitting && "is-loading"}
                            color={colors.gray.oneHundred}
                            disabled={!passwordValidated || !email || submitting}
                            form="signup-form"
                            padding="16px"
                            type="submit"
                            width="100%"
                          >
                            {submitting ? (
                              <Icon>
                                <CircleNotch size="1rem" />
                              </Icon>
                            ) : (
                              <span>Create account</span>
                            )}
                          </Button>
                        </StyledFieldset>
                      </form>
                    </>
                  )}
                </>
              )}
            </Box>
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default Invite