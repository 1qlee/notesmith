import React, { useState } from "react"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { ArrowRight, Warning } from "phosphor-react"
import { colors } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

import { StyledLabel, StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

function CreateBookModal({
  setShowModal,
  setBookData,
  bookData,
  pageData,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const [bookTitleError, setBookTitleError] = useState({
    show: false,
    msg: "",
  })

  function createNewBook() {
    if (!bookData.title || bookData.title.trim().length === 0) {
      console.log('error')
      setBookTitleError({
        show: true,
        msg: "Please enter a title."
      })
    }
    else {
      const newBookRef = firebaseDb.ref("books/").push()
      const newBookKey = newBookRef.key
      const pagesObject = {}

      for (let i = 1; i <= bookData.numOfPages; i++) {
        // create a new page key (id)
        const newPageRef = firebaseDb.ref("pages/").push()
        const newPageKey = newPageRef.key
        const newPageSvg = `<svg id="page-${i}" xmlns="http://www.w3.org/2000/svg"><rect width="${pageData.pageWidth}" height="${pageData.pageHeight}" fill="#fff"></rect></svg>`
        // keep track of each page in this object - it will be used later to set pages in 'books'
        pagesObject[`${newPageKey}`] = true
        // write the new page into the db
        newPageRef.set({
          "date_created": new Date().valueOf(),
          "id": newPageKey,
          "size": bookData.size,
          "bookId": newBookKey,
          "uid": user.uid,
          "pageNumber": i,
          "svg": newPageSvg,
          "width": pageData.pageWidth,
          "height": pageData.pageHeight,
        }).catch(error => {
          console.log("error writing page to the database")
        })
      }

      // write the new book into the db
      newBookRef.set({
        "date_created": new Date().valueOf(),
        "id": newBookKey,
        "numOfPages": bookData.numOfPages,
        "width": bookData.width,
        "height": bookData.height,
        "pages": pagesObject,
        "size": bookData.size,
        "title": bookData.title,
        "coverColor": bookData.coverColor,
        "uid": user.uid,
      }).then(() => {
        // afterwards, log that book id into 'users/userId/books/bookId'
        firebaseDb.ref(`users/${user.uid}/books`).child(newBookKey).set(true)

        // close modal
        setShowModal({
          show: false,
          type: "",
        })

        // finally, redirect the user to the newly created book page
        navigate(`/customize/notebook/${newBookKey}`)
      }).catch(error => {
        console.log("error writing book to the database")
      })
    }
  }

  return (
    <Modal
      setShowModal={setShowModal}
      unclickable={true}
      width="300px"
    >
      <ModalHeader>Create a new book</ModalHeader>
      <ModalContent>
        <Content
          margin="0 0 1rem 0"
        >
          <p>You can begin editing your new book after you create a title for it below. This book will then be saved to your account.</p>
        </Content>
        <Flexbox
          margin="0 0 1rem"
        >
          <form autoComplete="off">
            <StyledLabel>Title</StyledLabel>
            <StyledInput
              borderradius="0.25rem"
              type="text"
              id="new-book-title"
              name="new-book-title"
              placeholder="Enter a title for your new book"
              className={bookTitleError.show ? "is-error" : null}
              onFocus={() => setBookTitleError({
                show: false,
                msg: "",
              })}
              onChange={e => setBookData({
                ...bookData,
                title: e.target.value
              })}
            />
          </form>
          {bookTitleError.show && (
            <ErrorLine color={colors.red.sixHundred}>
              <Icon>
                <Warning weight="fill" color={colors.red.sixHundred} size={18} />
              </Icon>
              <span>{bookTitleError.msg}</span>
            </ErrorLine>
          )}
        </Flexbox>
      </ModalContent>
      <ModalFooter
        justifycontent="flex-end"
      >
        <Link
          to="/notebooks/wired-notebook/"
        >
          <Button
            backgroundcolor={colors.gray.twoHundred}
            fontsize="0.8rem"
            margin="0 0.5rem 0 0"
          >
            Back to shop
          </Button>
        </Link>
        <Button
          backgroundcolor={colors.primary.sixHundred}
          color={colors.primary.white}
          flex="flex"
          fontsize="0.8rem"
          onClick={e => createNewBook()}
        >
          <span>
            Create book
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateBookModal
