import React, { useState } from "react"
import styled from "styled-components"
import Button from "../ui/Button"
import { colors, regex } from "../../styles/variables"
import { CircleNotch } from "phosphor-react"

import { StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "./FormComponents"
import { Flexbox } from "../layout/Flexbox"
import Icon from "../ui/Icon"

function RegisterForm({
  color,
}) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })
  const [emailValidated, setEmailValidated] = useState(false)

  const sendgridSignUp = async e => {
    e.preventDefault()
    setLoading(true)

    if (regex.email.test(email)) {
      setEmailError({
        msg: "",
        color: colors.gray.sevenHundred
      })
      setEmailValidated(true)
      setEmail(email)

      const response = await fetch("/.netlify/functions/register-signup", {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email
        })
      }).then(res => {
        const promise = res.json()

        promise.then(obj => {
          // if the response contains any errors, throw an Error
          if (obj.errors) {
            throw obj.errors
          }
          else {
            setLoading(false)
            setEmailValidated(false)
            setEmailError({
              msg: obj.msg,
              color: colors.green.sixHundred
            })
          }
        })
      }).catch(err => {
        setLoading(false)
        setEmailValidated(false)
        setEmailError({
          msg: "Something went wrong. Please try again.",
          color: colors.red.sixHundred
        })
      })
    }
    else {
      setLoading(false)
      setEmailValidated(false)
      setEmail("")
      setEmailError({
        msg: "Invalid format",
        color: colors.red.sixHundred
      })
    }
  }

  return (
    <form 
      id="register-form"
      onSubmit={e => sendgridSignUp(e)}
    >
      <Flexbox
        alignitems="flex-end"
        flex="flex"
      >
        <StyledFieldset
          width="100%"
          className="is-vertical"
        >
          <StyledInput
            onFocus={() => setEmailError({
                    msg: "",
                    color: colors.red.sixHundred
                  })}
            onChange={e => setEmail(e.currentTarget.value)}
            id="register-form-input"
            type="email"
            name="email"
            placeholder="Enter your email address"
          />
        </StyledFieldset>
        <Button
          color={color === "dark" ? colors.gray.oneHundred : colors.gray.nineHundred}
          backgroundcolor={color === "dark" ? colors.gray.nineHundred : colors.gray.oneHundred}
          padding="1rem"
          type="submit"
          form="register-form"
          className={loading ? "is-loading" : null}
          disabled={emailValidated}
          margin="0 0 0 2px"
          width="80px"
        >
          {loading ? (
            <Icon>
              <CircleNotch size="1rem" />
            </Icon>
          ) : (
            <span>Sign up</span>
          )}
        </Button>
      </Flexbox>
      {emailError.msg && (
        <ErrorLine color={emailError.color}>
          <span>{emailError.msg}</span>
        </ErrorLine>
      )}
    </form>
  )
}

export default RegisterForm
