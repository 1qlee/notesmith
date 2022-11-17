import React, { useState } from "react"
import { colors, regex } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { Warning } from "phosphor-react"

import { Flexbox, FlexboxButtons } from "../layout/Flexbox"
import { StyledInput, StyledLabel, StyledFieldset, ErrorLine } from "./FormComponents"
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
    user.updateEmail(newEmail).then(() => {
      saveChanges()
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
    })
  }

  // function to update password
  function updatePassword() {
    user.updatePassword(newPassword).then(res => {
      saveChanges()
    }).catch(error => {
      if (error.code === "auth/requires-recent-login") {
        setShowModal({
          show: true,
          type: "reauthentication",
          process: "changePassword"
        })
      }
      else {
        console.log(error.message)
      }
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
      user.reauthenticateWithCredential(getAuthCredential(user.email, reauthenticatedPassword))
      .then(res => {
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
      user.reauthenticateWithCredential(getAuthCredential(user.email, reauthenticatedPassword))
      .then(res => {
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
      updatePassword(newPassword)
    }
    else {
      console.log("bad password")
    }
  }

  return (
    <>
      <Flexbox
        flex="flex"
        alignitems="center"
        justifycontent="space-between"
        margin="16px 0"
      >
        <h2>Account Information</h2>
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
              Change
            </Button>
          )}
        </FlexboxButtons>
      </Flexbox>
      <form id="settings-form" name="settings-form" onSubmit={e => handleSettingsFormSubmit(e)}>
        <Flexbox
          flex="flex"
          alignitems="flex-start"
          justifycontent="space-between"
          margin="2rem 0"
        >
          <Content>
            <StyledLabel>Email address</StyledLabel>
            <p>This email is used for communication and for logging into your account.</p>
          </Content>
          {showSettingsForm ? (
            <StyledFieldset className="is-vertical">
              <StyledInput
                className="has-width-auto"
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
            </StyledFieldset>
          ) : (
            <p>{user.email}</p>
          )}
        </Flexbox>
        <Flexbox
          flex="flex"
          alignitems="flex-start"
          justifycontent="space-between"
          margin="2rem 0"
        >
          <Content>
            <StyledLabel>Email address</StyledLabel>
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
            <p>••••••••</p>
          )}
        </Flexbox>
      </form>
      {showModal.show && (
        <Modal setShowModal={setShowModal}>
          {showModal.type === "reauthentication" ? (
            <>
              <ModalHeader>
                <h5>Please confirm your password to continue.</h5>
              </ModalHeader>
              <ModalContent>
                <Content>
                  <form id="reauthentication" noValidate
                    onSubmit={e => handleReauthenticationSubmit(e)}
                  >
                    <StyledFieldset
                      className="is-vertical"
                      margin="1rem 0"
                    >
                      <StyledLabel htmlFor="current-password">Password</StyledLabel>
                      <StyledInput
                        borderradius="0"
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
                    </StyledFieldset>
                  </form>
                </Content>
              </ModalContent>
              <ModalFooter>
                <Button
                  backgroundcolor={colors.primary.sixHundred}
                  color={colors.white}
                  width="100%"
                  form="reauthentication"
                  type="submit"
                  disabled={loading}
                  className="is-medium"
                >
                  Continue
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                <h3>Change your password</h3>
              </ModalHeader>
              <ModalContent>
                <Content>
                  <form id="change-password" noValidate onSubmit={e => handleChangePasswordSubmit(e)}>
                    <StyledFieldset
                      className="is-vertical"
                      margin="1rem 0"
                    >
                      <StyledLabel htmlFor="new-password">New Password (min. 8 characters)</StyledLabel>
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
                >
                  Change password
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
