import React, { useState } from "react"
import styled from "styled-components"
import Button from "../ui/Button"
import { colors, fonts } from "../../styles/variables"
import { CircleNotch, PaperPlaneRight } from "phosphor-react"
import { useFirebaseContext } from "../../utils/auth"
import { ref, set, push, get, query, orderByChild, equalTo } from "firebase/database"

import Icon from "../ui/Icon"
import { StyledInput, ErrorLine } from "./FormComponents"

const InputWrapper = styled.div`
  position: relative;
`

const InputLabel = styled.label`
  background-color: ${colors.white};
  border: ${props => props.border && colors.borders.black};
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
  top: ${props => props.top || "8px"};
`

const EmailInput = styled(StyledInput)`
  padding: 24px 16px 8px;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  font-size: ${props => props.fontsize};
  &.has-value {
    width: calc(100% - 36px);
  }
  &:focus {
    box-shadow: none;
  }
`

function RegisterForm({ border, fontsize, top, color }) {
  const { firebaseDb } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.threeHundred
  })

  const sendRegisterEmail = async (newSignupKey) => {
    const response = await fetch("/.netlify/functions/register-signup", {
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
      setEmailError({
        msg: "Please double-check your inputted email address.",
        color: colors.red.threeHundred
      })
    }
    else {
      setLoading(false)
      setEmailError({
        msg: data.msg,
        color: color || colors.gray.oneHundred
      })
    }
  }


  const registerEmail = e => {
    e.preventDefault()
    setLoading(true)
    setEmailError({
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
          setEmailError({
            msg: "This email is already registered.",
            color: colors.red.threeHundred
          })
        }
        else {
          sendRegisterEmail(signup.id)
        }

        setLoading(false)
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
          setEmailError({
            msg: "An error occured. Please try again.",
            color: colors.red.threeHundred
          })
        })
      }
    })
  }

  return (
    <form 
      id="register-form"
      onSubmit={e => registerEmail(e)}
    >
      <InputWrapper>
        <InputLabel 
          htmlFor="register-form-input"
          border={border}
        >
          <EmailInput
            onFocus={() => setEmailError({
              msg: "",
              color: colors.red.threeHundred
            })}
            onChange={e => setEmail(e.currentTarget.value)}
            className={email && "has-value"}
            id="register-form-input"
            type="email"
            name="email"
            margin="0"
            autoComplete="off"
            fontsize={fontsize}
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
              disabled={loading}
              margin="0 0 0 2px"
              top={top}
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
