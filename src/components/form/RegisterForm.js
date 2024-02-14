import React, { useState } from "react"
import styled from "styled-components"
import Button from "../ui/Button"
import { colors, fonts } from "../../styles/variables"
import { CircleNotch, PaperPlaneRight, Check } from "@phosphor-icons/react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, set, push, get, query, orderByChild, equalTo } from "firebase/database"

import Icon from "../ui/Icon"
import { StyledInput, ErrorLine } from "./FormComponents"

const InputWrapper = styled.div`
  position: relative;
  margin: ${props => props.margin};
`

const InputLabel = styled.label`
  background-color: ${colors.white};
  border: ${props => props.border && colors.borders.black};
  display: block;
  font-family: ${fonts.secondary};
  font-size: 1rem;
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
  top: ${props => props.top || "12px"};
`

const EmailInput = styled(StyledInput)`
  padding: 24px 16px 8px;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  font-size: ${props => props.fontsize};
  &.has-value {
    padding: 24px 76px 8px 16px;
    width: 100%;
  }
  &:focus {
    box-shadow: none;
  }
`

function RegisterForm({ id, border, margin, fontsize, top, color }) {
  const formId = id ? `${id}` : "register-form"
  const inputId = id ? `${id}-input` : "register-form-input"
  const { firebaseDb } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailCd, setEmailCd] = useState(false)
  const [inputMsg, setInputMsg] = useState({
    msg: "",
    color: colors.red.sixHundred
  })

  const sendRegisterEmail = async (newSignupKey, customMsg) => {
    if (emailCd) {
      setLoading(false)
      setInputMsg({
        msg: "Please wait a few seconds before trying again.",
        color: colors.red.sixHundred
      })
    } 
    else {
      const response = await fetch("/.netlify/functions/send-email-register", {
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          id: newSignupKey,
        })
      })
      const data = await response.json()

      if (data.error) {
        setLoading(false)
        setInputMsg({
          msg: "Please double-check your inputted email address.",
          color: colors.red.sixHundred
        })
      }
      else {
        setEmailCd(true)
        setLoading(false)
        setInputMsg({
          msg: customMsg || data.msg,
          color: colors.green.sixHundred,
        })
        setTimeout(() => {
          setEmailCd(false)
          setInputMsg({
            ...inputMsg,
            msg: "",
          })
        }, 5000)
      }
    }
  }

  const registerEmail = e => {
    e.preventDefault()
    setLoading(true)
    setInputMsg({
      msg: "",
      color: color || colors.gray.oneHundred
    })

    get(query(ref(firebaseDb, "signups"), orderByChild("email"), equalTo(email))).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        let signup;

        // extra object
        for (const key in data) {
          signup = data[key]
        }

        if (signup.subscribed) {
          setInputMsg({
            msg: "This email is already registered.",
            color: colors.red.sixHundred
          })
          setLoading(false)
        }
        else {
          sendRegisterEmail(signup.id, "Re-sent email.")
        }
      }
      else {
        const newSignupKey = push(ref(firebaseDb, "signups")).key
        // add the email with a unique id to the database
        // we will use the id to link the user to subscription page from an email
        set(ref(firebaseDb, `signups/${newSignupKey}`), {
          email: email,
          id: newSignupKey,
          subscribed: false,
        }).then(async () => {
          sendRegisterEmail(newSignupKey)
        }).catch(() => {
          setLoading(false)
          setInputMsg({
            msg: "An error occured. Please try again.",
            color: colors.red.sixHundred
          })
        })
      }
    })
  }

  return (
    <form 
      id={formId}
      onSubmit={e => registerEmail(e)}
    >
      <InputWrapper
        margin={margin}
      >
        <InputLabel 
          htmlFor={inputId}
          border={border}
        >
          <EmailInput
            onFocus={() => setInputMsg({
              msg: "",
              color: colors.red.sixHundred
            })}
            onChange={e => setEmail(e.currentTarget.value)}
            className={email && "has-value"}
            id={inputId}
            type="email"
            name="email"
            margin="0"
            autoComplete="off"
            fontsize={fontsize}
          />
          <label
            className={email && "has-value"}
            htmlFor={inputId}
          >
            Email address
          </label>
          {email && (
            <InputButton
              color={colors.gray.oneHundred}
              backgroundcolor={colors.gray.nineHundred}
              padding="8px"
              type="submit"
              form={formId}
              className={loading ? "is-loading" : null}
              disabled={loading || emailCd}
              margin="0 0 0 2px"
              top={top}
            >
              {loading ? (
                <Icon>
                  <CircleNotch size={16} />
                </Icon>
              ) : (
                "Submit"
              )}
            </InputButton>
          )}
        </InputLabel>
      </InputWrapper>
      {inputMsg.msg && (
        <ErrorLine color={inputMsg.color}>
          <span>{inputMsg.msg}</span>
        </ErrorLine>
      )}
    </form>
  )
}

export default RegisterForm
