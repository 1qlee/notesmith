import React, { useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"
import { ref, get, update } from "firebase/database"

const StyledTitleBox = styled.div`
  background-color: ${colors.white};
  flex: 1 1 33%;
  padding: 1rem;
  position: relative;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  p {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;
    white-space: nowrap;
    word-break: break-all;
  }
  &:hover {
    background-color: ${colors.gray.oneHundred};
    cursor: pointer;
  }
  &.is-active {
    background-color: ${colors.white};
  }
`

const TitleInput = styled.input`
  border:none;
  background-color: transparent;
  padding: 0;
  text-align: center;
  height: 100%;
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
      toast.error("Title is too long!")
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

      get(ref(firebaseDb, `/books/${bookId}/title`)).then(snapshot => {
        if (snapshot.val() === title) {
          setLoading(false)
        }
        else {
          const updates = {}
          updates[`/books/${bookId}/title`] = title

          update(ref(firebaseDb), updates).then(() => {
          }).then(() => {
            toast.success("Title successfully updated.")
            setLoading(false)
          }).catch(error => {
            console.log(error)
            toast.error("Something went wrong. Please try again.")
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
