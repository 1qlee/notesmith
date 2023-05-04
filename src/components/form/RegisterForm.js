import React, { useState } from "react"
import styled from "styled-components"
import Button from "../ui/Button"
import { colors, fonts } from "../../styles/variables"
import { CircleNotch, PaperPlaneRight } from "phosphor-react"

import Icon from "../ui/Icon"
import { StyledInput, ErrorLine } from "./FormComponents"

const InputWrapper = styled.div`
  position: relative;
`

const InputLabel = styled.label`
  background-color: ${colors.white};
  display: block;
  font-family: ${fonts.secondary};
  font-size: 0.875rem;
  border-radius: 4px;
  width: 100%;
  &:hover {
    cursor: text;
  }
  label {
    transition: top 0.2s ease-in-out, font-size 0.2s ease-in-out;
    position: absolute;
    top: 16px;
    left: 16px;
    color: ${colors.gray.sixHundred};
    &:hover {
      cursor: text;
    }
    &.has-value {
      top: 8px;
      font-size: 0.625rem;
      color: ${colors.gray.nineHundred};
    }
  }
  input {
    &:focus {
      & + label {
        top: 8px;
        font-size: 0.625rem;
        color: ${colors.gray.nineHundred};
      }
    }
  }
`

const InputButton = styled(Button)`
  position: absolute;
  right: 8px;
  top: 8px;
`

const EmailInput = styled(StyledInput)`
  padding: 24px 16px 8px;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  &.has-value {
    width: calc(100% - 36px);
  }
  &:focus {
    box-shadow: none;
  }
`

function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })

  const sendgridSignUp = async e => {
    e.preventDefault()
    setLoading(true)
    setEmailError({
      msg: "",
      color: colors.gray.sevenHundred
    })
    setEmail(email)

    await fetch("/.netlify/functions/register-signup", {
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
          setEmailError({
            msg: obj.msg,
            color: colors.green.sixHundred
          })
        }
      })
    }).catch(() => {
      setLoading(false)
      setEmailError({
        msg: "Please double-check your inputted email address.",
        color: colors.red.sixHundred
      })
    })
  }

  return (
    <form 
      id="register-form"
      onSubmit={e => sendgridSignUp(e)}
    >
      <InputWrapper>
        <InputLabel 
          htmlFor="register-form-input"
        >
          <EmailInput
            onFocus={() => setEmailError({
              msg: "",
              color: colors.red.sixHundred
            })}
            onChange={e => setEmail(e.currentTarget.value)}
            className={email && "has-value"}
            id="register-form-input"
            type="email"
            name="email"
            margin="0"
            autoComplete="off"
          />
          <label
            className={email && "has-value"}
            htmlFor="register-form-input"
          >
            Email address
          </label>
          {email && (
            <InputButton
              color={colors.gray.oneHundred}
              backgroundcolor={colors.gray.nineHundred}
              padding="8px"
              type="submit"
              form="register-form"
              className={loading ? "is-loading" : null}
              margin="0 0 0 2px"
            >
              <Icon>
                {loading ? (
                  <CircleNotch size={16} />
                ) : (
                  <PaperPlaneRight size={16} color={colors.gray.oneHundred} weight="fill" />
                )}
              </Icon>
            </InputButton>
          )}
        </InputLabel>
      </InputWrapper>
      {emailError.msg && (
        <ErrorLine color={emailError.color}>
          <span>{emailError.msg}</span>
        </ErrorLine>
      )}
    </form>
  )
}

export default RegisterForm
