import React, { useState, useRef } from "react"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { Warning, CircleNotch } from "phosphor-react"
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
  productData,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const [processing, setProcessing] = useState(false)
  const [bookTitleError, setBookTitleError] = useState({
    show: false,
    msg: "",
  })
  const buttonRef = useRef(null)

  function createNewBook() {
    setProcessing(true)
    // if the booktitle is empty
    if (!bookData.title || bookData.title.trim().length === 0) {
      setBookTitleError({
        show: true,
        msg: "Please enter a title."
      })
      setProcessing(false)
    }
    else {
      const newBookRef = firebaseDb.ref("books/").push()
      const newBookKey = newBookRef.key
      const pagesObject = {}

      for (let i = 1; i <= bookData.numOfPages; i++) {
        // create a new page key (id)
        const newPageRef = firebaseDb.ref("pages/").push()
        const newPageKey = newPageRef.key
        let newPageSvg = null
        // keep track of each page in this object - it will be used later to set pages in 'books'
        pagesObject[`${newPageKey}`] = true
        // svg for a blank page
        newPageSvg = {
          name: "rect",
          width: pageData.pageHeight,
          height: pageData.pageWidth,
          fill: "#fff",
        }
        // write the new page into the db
        newPageRef.set({
          "bookId": newBookKey,
          "id": newPageKey,
          "pageNumber": i,
          "svg": {
            "rect-01": newPageSvg,
          },
          "uid": user.uid,
        }).catch(error => {
          console.log("error writing page to the database")
        })
      }

      // write the new book into the db
      newBookRef.set({
        "coverColor": bookData.coverColor,
        "date_created": new Date().valueOf(),
        "heightPixel": bookData.heightPixel,
        "heightInch": bookData.heightInch,
        "id": newBookKey,
        "name": bookData.name,
        "numOfPages": bookData.numOfPages,
        "pages": pagesObject,
        "size": bookData.size,
        "title": bookData.title,
        "uid": user.uid,
        "slug": bookData.slug,
        "widthPixel": bookData.widthPixel,
        "widthInch": bookData.widthInch,
      }).then(() => {
        // afterwards, log that book id into 'users/userId/books/bookId'
        firebaseDb.ref(`users/${user.uid}/books`).child(newBookKey).set(true)
        // close modal
        setShowModal({
          show: false,
          type: "",
        })
        setProcessing(false)

        // finally, redirect the user to the newly created book page
        navigate(`/customize/${productData.slug}/${newBookKey}`, { replace: true })
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
          to={`/products/${productData.category}/${productData.slug}`}
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
          className={processing ? "is-loading" : null}
          color={colors.primary.white}
          disabled={processing || !bookData.title || bookData.title.trim().length === 0}
          flex="flex"
          fontsize="0.8rem"
          onClick={e => createNewBook()}
          ref={buttonRef}
        >
          {processing ? (
            <Icon width="74px">
              <CircleNotch weight="bold" fill={colors.primary.white} />
            </Icon>
          ) : (
            "Create book"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateBookModal
