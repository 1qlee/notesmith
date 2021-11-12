import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput } from "../../form/FormComponents"

const StyledTitleBox = styled.div`
  align-items: center;
  background-color: ${colors.paper.offWhite};
  border-radius: 0.25rem;
  border: 1px solid transparent;
  box-shadow: 0 0 0 ${colors.primary.oneHundred};
  display: flex;
  height: 2rem;
  padding: 0;
  position: relative;
  transition: padding 0.2s, transform 0.2s, border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  width: 300px;
  p {
    align-items: center;
    display: flex;
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
  &:hover {
    background-color: ${colors.white};
    box-shadow: ${colors.shadow.layered};
    transform: translateY(-1px);
    cursor: pointer;
    padding: 0 0.5rem;
  }
  &.is-active {
    background-color: ${colors.white};
    border-color: ${colors.primary.sixHundred};
    box-shadow: 0 0 0 ${colors.primary.oneHundred};
    padding: 0 0.5rem;
    transform: translate(1px,1px);
  }
`

const TitleInput = styled.input`
  border:none;
  background-color: transparent;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  padding: 0;
  width: 100%;
  &:focus {
    outline: none;
  }
`

const ErrorMsg = styled.span`
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  font-size: 0.75rem;
  padding: 0.25rem;
  background-color: ${props => props.color};
  box-shadow: 2px 2px 6px ${props => props.shadowcolor};
  border-radius: 0 0.25rem 0.25rem;
  color: ${colors.white};
`

function TitleBox({
  bookData,
  setBookData,
  bookId,
}) {
  const { firebaseDb } = useFirebaseContext()
  const [showTitleInput, setShowTitleInput] = useState(false)
  const [error, setError] = useState({
    show: false,
    msg: "",
    color: colors.red.sixHundred,
    shadowcolor: colors.red.fourHundred,
  })
  const titleInput = useRef(null)
  const [loading, setLoading] = useState(false)

  function hideErrorMsg() {
    // make the error msg disappear after 3secs
    setTimeout(() => {
      setError({
        show: false,
        msg: "",
        color: colors.red.sixHundred,
        shadowcolor: colors.red.fourHundred,
      })
    }, 3000)
  }

  function validateBookTitle(title) {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError({
        show: true,
        msg: "Title field was empty.",
        color: colors.red.sixHundred,
        shadowcolor: colors.red.fourHundred,
      })
    }
    else if (trimmedTitle.length > 255) {
      setError({
        show: true,
        msg: "Title was too long.",
        color: colors.red.sixHundred,
        shadowcolor: colors.red.fourHundred,
      })
    }
    else {
      return trimmedTitle
    }

    hideErrorMsg()
  }

  function submitNewBookTitle(e) {
    // enter or esc
    if (e.keyCode === 13 || e.keyCode === 27) {
      e.target.blur()
    }
  }

  function setNewBookTitle(title) {
    if (validateBookTitle(title)) {
      setLoading(true)
      setBookData({
        ...bookData,
        title: title,
      })

      const updates = {}
      updates[`/books/${bookId}/title`] = title

      firebaseDb.ref().update(updates, error => {
        if (error) {
          console.log("Error occurred when updating book title.")
        }
      }).then(() => {
        console.log("updated db title")
        setError({
          show: true,
          msg: "Title updated.",
          color: colors.green.sixHundred,
          shadowcolor: colors.green.fourHundred,
        })

        setLoading(false)
        hideErrorMsg()
      })
    }
  }

  function handleTitleBoxClick() {
    setShowTitleInput(true)
    setError({
      show: false,
      msg: "",
      color: colors.red.sixHundred,
      shadowcolor: colors.red.fourHundred,
    })

    // have to wait for input to mount
    setTimeout(() => {
      titleInput.current.focus()
    }, 20)
  }

  return (
    <StyledTitleBox
      className={showTitleInput && "is-active"}
      onClick={() => handleTitleBoxClick()}
    >
      {showTitleInput ? (
        <TitleInput
          ref={titleInput}
          type="text"
          defaultValue={bookData.title}
          onBlur={e => {
            setNewBookTitle(e.target.value)
            setShowTitleInput(false)
          }}
          onFocus={e => e.target.select()}
          onKeyDown={e => submitNewBookTitle(e)}
          disabled={loading}
        />
      ) : (
        <p>{bookData.title}</p>
      )}
      {error.show && (
        <ErrorMsg
          color={error.color}
          shadowcolor={error.shadowcolor}
        >
          {error.msg}
        </ErrorMsg>
      )}
    </StyledTitleBox>
  )
}

export default TitleBox
