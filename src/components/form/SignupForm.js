import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { Warning } from "phosphor-react"

import { AuthFormWrapper, StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import Seo from "../layout/Seo"

const SignUpForm = () => {
  const { signUp, sendEmailVerification, firebaseDb } = useFirebaseContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })
  const [passwordError, setPasswordError] = useState({
    msg: "",
    color: colors.gray.sevenHundred
  })
  const [emailValidated, setEmailValidated] = useState()
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
        user.sendEmailVerification().then(() => {
          navigate("/app/dashboard")
        }).catch(error => {
          console.log(error.code, error.msg)
        })
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

  function validateEmail(email) {
    if (regex.email.test(email) || email.length === 0) {
      setEmailError({
        msg: "",
        color: colors.gray.sevenHundred
      })
      setEmailValidated(true)
      setEmail(email)
    }
    else {
      setEmailError({
        msg: "Invalid format",
        color: colors.red.sixHundred
      })
      setEmailValidated(false)
    }
  }

  function validatePassword(password) {
    let additionalCharsReq = 8 - password.length

    if (regex.password.test(password)) {
      setPasswordError({
        msg: "",
        color: colors.gray.sevenHundred
      })
      setPasswordValidated(true)
      setPassword(password)
    }
    else {
      if (password.length > 0) {
        setPasswordError({
          msg: additionalCharsReq === 1 ? `You need ${additionalCharsReq} more character.` : `You need ${additionalCharsReq} more characters.`,
          color: colors.gray.sevenHundred
        })
      }
      else if (password.length === 0) {
        setPasswordError({
          msg: "",
          color: colors.gray.sevenHundred
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
    <>
      <AuthFormWrapper>
        <Seo title="Sign Up" />
        <Content>
          <h4>Create your Notesmith account</h4>
        </Content>
        <form
          id="signup-form"
          onSubmit={e => handleSubmit(e)}
        >
          <StyledFieldset className="is-vertical">
            <StyledLabel>Email</StyledLabel>
            <StyledInput
              onChange={e => validateEmail(e.currentTarget.value)}
              className={emailError.msg && "is-error"}
              borderradius="0"
              id="email"
              type="email"
              name="email"
              autocomplete="email"
            />
            {emailError.msg && (
              <ErrorLine color={emailError.color}>
                <Icon>
                  <Warning weight="fill" color={emailError.color} size={16} />
                </Icon>
                <span>{emailError.msg}</span>
              </ErrorLine>
            )}
          </StyledFieldset>
          <StyledFieldset className="is-vertical has-space-bottom">
            <StyledLabel>Password</StyledLabel>
            <StyledInput
              onFocus={(e) => validatePassword(e.currentTarget.value)}
              onChange={(e) => validatePassword(e.currentTarget.value)}
              onBlur={(e) => validatePasswordOnBlur(e.currentTarget.value)}
              className={passwordError.msg && "is-error"}
              borderradius="0"
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
                  <Warning weight="fill" color={passwordError.color} size={16} />
                </Icon>
                <span>{passwordError.msg}</span>
              </ErrorLine>
            )}
          </StyledFieldset>
          <StyledFieldset>
            <Button
              color={colors.white}
              backgroundcolor={colors.primary.sixHundred}
              borderradius="0"
              disabled={passwordValidated && emailValidated && email.length > 0 ? false : true}
              type="submit"
              form="signup-form"
              width="100%"
              className="is-medium"
            >
              Create account
            </Button>
          </StyledFieldset>
        </form>
      </AuthFormWrapper>
    </>
  )
}

export default SignUpForm
