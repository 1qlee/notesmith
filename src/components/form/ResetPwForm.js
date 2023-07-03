import React, { useState } from "react"
import { colors } from "../../styles/variables"
import { WarningCircle, CircleNotch } from "phosphor-react"
import validatePassword from "../../functions/validatePassword"

import { StyledFieldset, StyledLabel, StyledInput, ErrorLine } from "./FormComponents"
import Icon from "../ui/Icon"
import Button from "../ui/Button"

function ResetPwForm({ handleSubmit, processing, actionCode }) {
  const [password, setPassword] = useState("")
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [confirmValidated, setConfirmValidated] = useState(false)
  const [confirmError, setConfirmError] = useState(null)

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

  function handleConfirmPwOnChange(confirmPassword) {
    if (confirmPassword === password) {
      setConfirmValidated(true)
      setConfirmError(null)
    }
    else {
      setConfirmValidated(false)
      setConfirmError("Passwords do not match.")
    }
  }

  return (
    <form
      onSubmit={e => handleSubmit(e, actionCode, password)}
      id="reset-pw-form"
    >
      <StyledFieldset
        margin="0 0 16px"
      >
        <StyledLabel>New password (min. 8 characters)</StyledLabel>
        <StyledInput
          onChange={e => handlePasswordOnChange(e.target.value)}
          onBlur={e => handlePasswordOnBlur(e.target.value)}
          id="password"
          type="password"
          name="password"
          autocomplete="new-password"
        />
        {passwordError && (
          <ErrorLine color={colors.red.sixHundred}>
            <Icon>
              <WarningCircle weight="fill" color={colors.red.sixHundred} size={16} />
            </Icon>
            <span>{passwordError}</span>
          </ErrorLine>
        )}
      </StyledFieldset>
      <StyledFieldset
        margin="0 0 32px"
      >
        <StyledLabel>Confirm new password</StyledLabel>
        <StyledInput
          onChange={e => handleConfirmPwOnChange(e.target.value)}
          id="confirm-password"
          type="password"
          name="confirm-password"
          autocomplete="new-password"
        />
        {confirmError && (
          <ErrorLine color={colors.red.sixHundred}>
            <Icon>
              <WarningCircle weight="fill" color={colors.red.sixHundred} size={16} />
            </Icon>
            <span>{confirmError}</span>
          </ErrorLine>
        )}
      </StyledFieldset>
      <StyledFieldset>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          className={processing && "is-loading"}
          color={colors.gray.oneHundred}
          disabled={!confirmValidated || processing}
          form="reset-pw-form"
          padding="16px"
          type="submit"
          width="100%"
        >
          {processing ? (
            <Icon>
              <CircleNotch size="1rem" />
            </Icon>
          ) : (
            <span>Create account</span>
          )}
        </Button>
      </StyledFieldset>
    </form>
  )
}

export default ResetPwForm