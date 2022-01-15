import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput } from "../../form/FormComponents"

const StyledTitleBox = styled.div`
  background-color: ${colors.white};
  flex: 1 1 33%;
  padding: 1rem;
  position: relative;
  transition: background-color 0.2s;
  p {
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;
    white-space: nowrap;
    word-break: break-all;
  }
  &:hover {
    background-color: ${colors.primary.hover};
    cursor: pointer;
  }
  &.is-active {
    background-color: ${colors.white};
  }
`

const TitleInput = styled.input`
  border:none;
  background-color: transparent;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
  padding: 0;
  text-align: center;
  width: 100%;
  &:focus {
    outline: none;
  }
`

function TitleBox({
  bookData,
  setBookData,
  bookId,
  toast,
}) {
  const { firebaseDb } = useFirebaseContext()
  const [loading, setLoading] = useState(false)
  const [showTitleInput, setShowTitleInput] = useState(false)
  const titleInput = useRef(null)

  function validateBookTitle(title) {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      toast.error("Please enter a title.")
    }
    else if (trimmedTitle.length > 255) {
      toast.error("Title is too long (255+ characters).")
    }
    else {
      return trimmedTitle
    }
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

      firebaseDb.ref(`/books/${bookId}/title`).once("value").then(snapshot => {
        if (snapshot.val() === title) {
          setLoading(false)
        }
        else {
          const updates = {}
          updates[`/books/${bookId}/title`] = title

          firebaseDb.ref().update(updates, error => {
            if (error) {
              console.log("Error occurred when updating book title.")
            }
          }).then(() => {
            toast.success("Title successfully updated.")
            setLoading(false)
          })
        }
      })
    }
  }

  function handleTitleBoxClick() {
    toast.dismiss()
    setShowTitleInput(true)

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
    </StyledTitleBox>
  )
}

export default TitleBox
