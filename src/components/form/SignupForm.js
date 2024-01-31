import React, { useState } from "react"
import { colors, marketingLists } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { WarningCircle, CircleNotch } from "@phosphor-icons/react"
import { get, ref, set, query, orderByChild, equalTo } from "firebase/database"
import sendEmailVerification from "../../functions/sendEmailVerification"
import validatePassword from "../../functions/validatePassword"
import addEmailToLists from "../../functions/addEmailToLists"

import { AuthFormWrapper, StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "../form/FormComponents"
import Button from "../ui/Button"
import Content from "../ui/Content"
import Icon from "../ui/Icon"

const SignupForm = () => {
  const { signUp, firebaseDb } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordValidated, setPasswordValidated] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    get(query(ref(firebaseDb, "earlyAccess"), orderByChild('email'), equalTo(email))).then((snapshot) => {
      if (snapshot.exists()) {
        setEmailError(null)

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
          // Send the user a verification email
          await sendEmailVerification(user.email)
          await addEmailToLists(user.email, marketingLists)

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

        return true
      }
      else {
        setEmailError("This email does not have early access yet!")
        setLoading(false)
        return false
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
    <AuthFormWrapper>
      <Content
        h1fontsize="2rem"
        margin="0 0 32px"
        linktextdecoration="underline"
      >
        <h1>Create your account</h1>
        <p>Only users who have been granted early access may create an account at this time. If you would like to get early access please <Link to="/waitlist">sign up for the waitlist</Link>.</p>
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
      <Content
        paragraphtextalign="center"
        linktextdecoration="underline"
        margin="16px 0 0"
      >
        <p>Already have an account? <Link to="/signin">Sign in</Link></p>
      </Content>
    </AuthFormWrapper>
  )
}

export default SignupForm