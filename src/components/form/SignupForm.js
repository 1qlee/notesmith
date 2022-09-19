import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { WarningCircle } from "phosphor-react"
import sendEmailVerification from "../../functions/sendEmailVerification"

import { AuthFormWrapper, StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import Seo from "../layout/Seo"

const SignupForm = () => {
  const { signUp, firebaseDb } = useFirebaseContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })
  const [passwordError, setPasswordError] = useState({
    msg: "",
    color: colors.gray.nineHundred
  })
  const [passwordValidated, setPasswordValidated] = useState()

  function handleSubmit(e) {
    e.preventDefault()
    signUp(email, password).then(userObject => {
      const { user } = userObject
      // Record new user in the db
      firebaseDb.ref('users/' + user.uid).set({
        email: user.email
      }).then(() => {
        // Send the user a verification email
        sendEmailVerification(user.email)
      })
    })
    .catch(error => {
      switch(error.code) {
        case "auth/email-already-in-use":
          setEmailError({
            msg: "This email is already in use.",
            color: colors.red.sixHundred
          })
          break
        case "auth/invalid-email":
          setEmailError({
            msg: "Email was in an invalid format.",
            color: colors.red.sixHundred
          })
          break
        case "auth/operation-not-allowed":
          setEmailError({
            msg: "Sorry, our server is busy.",
            color: colors.red.sixHundred
          })
          break
        default:
          setEmailError({
            msg: "Something went wrong.",
            color: colors.red.sixHundred
          })
      }
    })
  }

  function validatePassword(password) {
    let additionalCharsReq = 8 - password.length

    if (regex.password.test(password)) {
      setPasswordError({
        msg: "",
        color: colors.gray.nineHundred
      })
      setPasswordValidated(true)
      setPassword(password)
    }
    else {
      if (password.length > 0) {
        setPasswordError({
          msg: additionalCharsReq === 1 ? `You need ${additionalCharsReq} more character.` : `You need ${additionalCharsReq} more characters.`,
          color: colors.gray.nineHundred
        })
      }
      else if (password.length === 0) {
        setPasswordError({
          msg: "",
          color: colors.gray.nineHundred
        })
      }
      setPasswordValidated(false)
    }
  }

  function validatePasswordOnBlur(password) {
    let currentNumOfChars = password.length

    if (currentNumOfChars !== 0 && currentNumOfChars < 8) {
      setPasswordValidated(false)
      return setPasswordError({
        msg: "Password must be at least 8 characters.",
        color: colors.red.sixHundred
      })
    }
  }

  return (
    <AuthFormWrapper>
      <Seo title="Sign Up" />
      <Content
        h1fontsize="2rem"
        margin="0 0 32px"
        linktextdecoration="underline"
      >
        <h1>Create your Notesmith account</h1>
        <p>Notesmith is currently in an open beta. All notebooks you purchase during this time are discounted. Feedback will be greatly appreciated.</p>
      </Content>
      <form
        id="signup-form"
        onSubmit={e => handleSubmit(e)}
      >
        <StyledFieldset
          className="is-vertical"
          margin="0 0 16px"
        >
          <StyledLabel>Email</StyledLabel>
          <StyledInput
            onChange={e => setEmail(e.currentTarget.value)}
            onFocus={() => setEmailError({...emailError, msg: ""})}
            className={emailError.msg && "is-error"}
            id="email"
            type="email"
            name="email"
            autocomplete="email"
          />
          {emailError.msg && (
            <ErrorLine color={emailError.color}>
              <Icon>
                <WarningCircle weight="fill" color={emailError.color} size={16} />
              </Icon>
              <span>{emailError.msg}</span>
            </ErrorLine>
          )}
        </StyledFieldset>
        <StyledFieldset
          className="is-vertical"
          margin="0 0 32px"
        >
          <StyledLabel>Password</StyledLabel>
          <StyledInput
            onFocus={(e) => validatePassword(e.currentTarget.value)}
            onChange={(e) => validatePassword(e.currentTarget.value)}
            onBlur={(e) => validatePasswordOnBlur(e.currentTarget.value)}
            className={passwordError.msg && "is-error"}
            id="password"
            type="password"
            name="password"
            autocomplete="new-password"
          />
          {passwordValidated && (
            <div style={{position: `absolute`, right: `1rem`, bottom: `0`}}>
              <Icon
                icon="ShieldCheck"
                weight="regular"
                size="1.5rem"
                color={colors.green.sixHundred}
              />
            </div>
          )}
          {passwordError.msg && (
            <ErrorLine color={passwordError.color}>
              <Icon>
                <WarningCircle weight="fill" color={passwordError.color} size={16} />
              </Icon>
              <span>{passwordError.msg}</span>
            </ErrorLine>
          )}
        </StyledFieldset>
        <StyledFieldset>
          <Button
            color={colors.gray.oneHundred}
            backgroundcolor={colors.gray.nineHundred}
            padding="16px"
            disabled={passwordValidated && email.length > 0 ? false : true}
            type="submit"
            form="signup-form"
            width="100%"
          >
            Create account
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
