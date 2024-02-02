import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { Warning, CircleNotch } from "@phosphor-icons/react"
import { reauthenticateWithCredential, updateEmail as fbUpdateEmail, updatePassword as fbUpdatePassword } from "firebase/auth"

import { Flexbox, FlexboxButtons } from "../layout/Flexbox"
import { StyledInput, StyledFieldset, StyledLabel, ErrorLine } from "./FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
import Button from "../ui/Button"

function SettingsForm() {
  const { user, getAuthCredential } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [showModal, setShowModal] = useState({
    show: false,
    type: "reauthentication",
    process: "reauthentication"
  })
  const [passwordError, setPasswordError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })
  const [emailError, setEmailError] = useState({
    msg: "",
    color: colors.red.sixHundred
  })
  const [emailValidated, setEmailValidated] = useState(false)
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [showSettingsForm, setShowSettingsForm] = useState(false)
  const [reauthenticatedPassword, setReauthenticatedPassword] = useState("")

  // validate email regex
  function validateEmail(email) {
    if (regex.email.test(email)) {
      clearError("email")
      setEmailValidated(true)
      setNewEmail(email)
    }
    else {
      setError("email", "Invalid format.")
      setEmailValidated(false)
    }
  }

  // validate password regex
  function validatePassword(password) {
    if (regex.password.test(password)) {
      setPasswordValidated(true)
      setNewPassword(password)
    }
    else {
      setPasswordValidated(false)
    }
  }

  // clear error messages
  function clearError(type) {
    if (type === "email") {
      setEmailError({
        msg: "",
        color: colors.red.sixHundred
      })
    }
    if (type === "password") {
      setPasswordError({
        msg: "",
        color: colors.red.sixHundred
      })
    }
  }

  // set an error message
  function setError(type, message, color) {
    if (type === "email") {
      setEmailError({
        msg: message,
        color: color || colors.red.sixHundred
      })
    }
    if (type === "password") {
      setPasswordError({
        msg: message,
        color: color || colors.red.sixHundred
      })
    }
  }

  // hide settings form and modal
  function saveChanges() {
    setShowSettingsForm(false)
    setShowModal({
      show: false
    })
  }

  // update email and present errors
  function updateEmail() {
    setLoading(true)

    fbUpdateEmail(user, newEmail).then(() => {
      saveChanges()
      setLoading(false)
    }).catch(error => {
      // handle various error-codes and show their respective error messages
      switch(error.code) {
        case "auth/email-already-in-use":
          setError("email", "Email already in use.")
          setShowModal({
            show: false,
            type: "reauthentication",
            process: "reauthentication"
          })
          break
        case "auth/invalid-email":
          setError("email", "Invalid format.")
          setShowModal({
            show: false,
            type: "reauthentication",
            process: "reauthentication"
          })
          break
        case "auth/requires-recent-login":
          setError("email", "Re-authenticate your account.")
          clearError("password")
          setShowModal({
            show: true,
            type: "reauthentication",
            process: "reauthentication"
          })
          break
        default:
          setShowSettingsForm(true)
      }

      setLoading(false)
    })
  }

  // function to update password
  function updatePassword() {
    setLoading(true)
    fbUpdatePassword(user, newPassword).then(() => {
      saveChanges()
      setLoading(false)
    }).catch(error => {
      if (error.code === "auth/requires-recent-login") {
        setShowModal({
          show: true,
          type: "reauthentication",
          process: "changePassword"
        })
      }
      setLoading(false)
    })
  }

  // function to submit the main settings form
  function handleSettingsFormSubmit(e) {
    e.preventDefault()
    // only allow submit if email is a valid value
    if (emailValidated) {
      updateEmail()
    }
  }

  // function to submit email change
  function handleReauthenticationSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (showModal.process === "reauthentication") {
      reauthenticateWithCredential(user, getAuthCredential(user.email, reauthenticatedPassword)).then(res => {
        updateEmail()
        clearError("email")
        clearError("password")
        setLoading(false)
      }).catch(error => {
        setError("password", "Incorrect password.")
        setLoading(false)
      })
    }
    if (showModal.process === "changePassword") {
      reauthenticateWithCredential(user, getAuthCredential(user.email, reauthenticatedPassword)).then(res => {
        updatePassword()
        setLoading(false)
        clearError("password")
      }).catch(error => {
        setError("password", "Incorrect password.")
        setLoading(false)
      })
    }
  }

  function handleChangePasswordSubmit(e) {
    e.preventDefault()
    if (regex.password.test(newPassword)) {
      updatePassword()
    }
  }

  async function handleChangeEmailSubmit(e) {
    e.preventDefault()


    await fetch("/.netlify/functions/send-email-template", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        to: newEmail,
        button_text: "Verify email change",
        button_url: "https://notesmithbooks.com/account/verify-email-change",
        templateId: "d-c306eb61b4914abca8a73f23265649be",
        heading: "Verify your new email address",
        subject: "Verify your new email address",
        preheader: "Verify your new email address",
        text: "You are receiving this email because you requested a change to your email address. Please click the button below to verify your new email address.",
      })
    }).then(res => {
      return res.json()
    }).then(async data => {
      if (data.error) {
        return data.error || "There was an error sending the verification email, please try again."
      }
      else {
        return null
      }
    }).catch(error => {
      return error || "There was an error sending the verification email, please try again."
    })
  }

  return (
    <>
      <Flexbox
        flex="flex"
        align="center"
        justify="space-between"
        className="has-border-bottom"
        margin="32px 0"
        padding="0 0 16px"
      >
        <Content
          h1fontsize="2rem"
          h1margin="0"
        >
          <h1>Profile</h1>
        </Content>
        <FlexboxButtons>
          {showSettingsForm ? (
            <>
              <Button
                backgroundcolor={colors.gray.oneHundred}
                color={colors.gray.nineHundred}
                onClick={() => {
                  setShowSettingsForm(false)
                  clearError("email")
                  setNewEmail("")
                  setEmailValidated(false)
                }}
              >
                Cancel
              </Button>
              <Button
                backgroundcolor={colors.gray.nineHundred}
                color={colors.gray.oneHundred}
                form="settings-form"
                type="submit"
                disabled={!emailValidated}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
              onClick={() => {
                setShowSettingsForm(true)
                setNewEmail("")
              }}
            >
              Edit
            </Button>
          )}
        </FlexboxButtons>
      </Flexbox>
      <form id="settings-form" name="settings-form" onSubmit={e => handleSettingsFormSubmit(e)}>
        {/* <Flexbox
          flex="flex"
          align="flex-start"
          justify="space-between"
          margin="16px 0"
          width="100%"
        >
          <Content
            h5margin="0 0 8px"
          >
            <h5>Email address</h5>
            <p>This email is used for communication and for logging into your account.</p>
          </Content>
          {showSettingsForm ? (
            <Button
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
              onClick={e => {
                e.preventDefault()
                setShowModal({
                  show: true,
                  type: "email"
                })
              }}
            >
              Change email
            </Button>
          ) : (
            <Content>
              <p>{user.email}</p>
            </Content>
          )}
        </Flexbox> */}
        <Flexbox
          flex="flex"
          align="flex-start"
          justify="space-between"
          margin="16px 0"
        >
          <Content
            h5margin="0 0 8px"
          >
            <h5>Password</h5>
            <p>Must be a minimum of eight characters.</p>
          </Content>
          {showSettingsForm ? (
            <Button
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
              onClick={e => {
                e.preventDefault()
                setShowModal({
                  show: true,
                  type: "password"
                })
              }}
            >
              Change password
            </Button>
          ) : (
            <Content
              paragraphfontsize="1.25rem"
            >
              <p>••••••••</p>
            </Content>
          )}
        </Flexbox>
      </form>
      {showModal.show && (
        <Modal setShowModal={setShowModal}>
          {showModal.type === "reauthentication" && (
            <>
              <ModalHeader>
                Please confirm your password to continue
              </ModalHeader>
              <ModalContent>
                <Content>
                  <p>It's been a while since you've logged into this account. Please confirm your original password below.</p>
                  <form id="reauthentication" noValidate
                    onSubmit={e => handleReauthenticationSubmit(e)}
                  >
                    <StyledLabel htmlFor="current-password">Password</StyledLabel>
                    <StyledInput
                      id="current-password"
                      type="password"
                      name="current-password"
                      onChange={e => setReauthenticatedPassword(e.currentTarget.value)}
                    />
                    {passwordError.msg && (
                      <ErrorLine color={passwordError.color}>
                        <Icon>
                          <Warning weight="fill" color={passwordError.color} size={16} />
                        </Icon>
                        <span>{passwordError.msg}</span>
                      </ErrorLine>
                    )}
                  </form>
                </Content>
              </ModalContent>
              <ModalFooter>
                <Button
                  backgroundcolor={colors.gray.nineHundred}
                  color={colors.white}
                  width="100%"
                  form="reauthentication"
                  type="submit"
                  padding="16px"
                  disabled={loading}
                  className={loading && "is-loading"}
                >
                  {loading ? (
                    <Icon>
                      <CircleNotch size="1rem" />
                    </Icon>
                  ) : (
                    <span>
                      Continue
                    </span>
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
          {showModal.type === "email" && (
            <>
              <ModalHeader>
                Change your email
              </ModalHeader>
              <ModalContent>
                <Content>
                  <p>We will send an email to your new email address for verification. Your account's email will not change until you verify your new email.</p>
                  <form 
                    id="change-email" 
                    noValidate 
                    onSubmit={e => handleChangeEmailSubmit(e)}
                  >
                    <StyledFieldset>
                      <StyledInput
                        placeholder={user.email}
                        onChange={e => validateEmail(e.currentTarget.value)}
                        fontsize="1rem"
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
                  </form>
                </Content>
              </ModalContent>
              <ModalFooter>
                <Button
                  backgroundcolor={colors.gray.nineHundred}
                  color={colors.gray.oneHundred}
                  width="100%"
                  form="change-email"
                  type="submit"
                  padding="16px"
                  disabled={!emailValidated || loading}
                  className={loading && "is-loading"}
                >
                  {loading ? (
                    <Icon>
                      <CircleNotch size="1rem" />
                    </Icon>
                  ) : (
                    <span>
                      Send verification email
                    </span>
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
          {showModal.type === "password" && (
            <>
              <ModalHeader>
                Change your password
              </ModalHeader>
              <ModalContent>
                <Content>
                  <form id="change-password" noValidate onSubmit={e => handleChangePasswordSubmit(e)}>
                    <StyledFieldset
                      className="is-vertical"
                      margin="0"
                    >
                      <StyledLabel htmlFor="new-password">New password (min. 8 characters)</StyledLabel>
                      <StyledInput
                        id="new-password"
                        type="password"
                        name="new-password"
                        autocomplete="new-password"
                        onChange={e => validatePassword(e.currentTarget.value)}
                      />
                    </StyledFieldset>
                  </form>
                </Content>
              </ModalContent>
              <ModalFooter>
                <Button
                  backgroundcolor={colors.gray.nineHundred}
                  color={colors.gray.oneHundred}
                  width="100%"
                  form="change-password"
                  type="submit"
                  padding="16px"
                  disabled={!passwordValidated || loading}
                  className={loading && "is-loading"}
                >
                  {loading ? (
                    <Icon>
                      <CircleNotch size="1rem" />
                    </Icon>
                  ) : (
                    <span>
                      Change password
                    </span>
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default SettingsForm
