import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { Warning } from "phosphor-react"

import { Flexbox, FlexboxButtons } from "../layout/Flexbox"
import { StyledInput, ErrorLine } from "./FormComponents"
import Content from "../Content"
import Icon from "../Icon"
import Button from "../Button"

function SettingsForm() {
  const { user, updateEmail } = useFirebaseContext()
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState({})
  const [emailValidated, setEmailValidated] = useState(false)
  const [showSettingsForm, setshowSettingsForm] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (emailValidated) {
      console.log("Attempting to change form values...")
      updateEmail(newEmail, setshowSettingsForm)
    }
  }

  function validateEmail(email) {
    if (regex.email.test(email) || email.length === 0) {
      setEmailError({
        msg: "",
        color: colors.gray.sevenHundred
      })
      setEmailValidated(true)
      setNewEmail(email)
    }
    else {
      setEmailError({
        msg: "Invalid format",
        color: colors.red.sixHundred
      })
      setEmailValidated(false)
    }
  }

  return (
    <>
      <Flexbox
        flex="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="2rem 0"
      >
        <h2>Settings</h2>
        <FlexboxButtons>
          {showSettingsForm ? (
            <>
              <Button
                backgroundColor={colors.gray.oneHundred}
                onClick={() => setshowSettingsForm(false)}
              >
                Cancel
              </Button>
              <Button
                backgroundColor={colors.primary.sixHundred}
                color={colors.primary.oneHundred}
                form="settings-form"
                type="submit"
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              backgroundColor={colors.gray.oneHundred}
              onClick={() => setshowSettingsForm(true)}
            >
              Edit settings
            </Button>
          )}
        </FlexboxButtons>
      </Flexbox>
      <form id="settings-form" name="settings-form" onSubmit={e => handleSubmit(e)}>
        <Flexbox
          flex="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          margin="2rem 0"
        >
          <div>
            <h4>Email</h4>
            <p>You'll use this email for all communications.</p>
          </div>
          {showSettingsForm ? (
            <div>
              <StyledInput
                className="has-width-auto"
                borderRadius="0.25rem"
                placeholder={user.email}
                onChange={e => validateEmail(e.currentTarget.value)}
              />
              {emailError.msg && (
                <ErrorLine color={emailError.color}>
                  <Icon>
                    <Warning weight="fill" color={emailError.color} size={16} />
                  </Icon>
                  <span>{emailError.msg}</span>
                </ErrorLine>
              )}
            </div>
          ) : (
            <p>{user.email}</p>
          )}
        </Flexbox>
        <Flexbox
          flex="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          margin="2rem 0"
        >
          <div>
            <h4>Password</h4>
            <p>Minimum eight characters.</p>
          </div>
          {showSettingsForm ? (
            <Button
              backgroundColor={colors.gray.oneHundred}
              onClick={e => e.preventDefault()}
            >
              Change password
            </Button>
          ) : (
            <p>••••••••</p>
          )}
        </Flexbox>
        <Flexbox
          flex="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          margin="2rem 0"
        >
          <div>
            <h4>Display Name</h4>
            <p>We'll call you by this name instead.</p>
          </div>
          {showSettingsForm ? (
            <StyledInput
              className="has-width-auto"
              borderRadius="0.25rem"
              placeholder={user.displayName}
            />
          ) : (
            <p>{user.displayName}</p>
          )}
        </Flexbox>
      </form>
    </>
  )
}

export default SettingsForm
