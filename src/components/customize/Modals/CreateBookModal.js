import React, { useState } from "react"
import { Link, navigate } from "gatsby"
import styled from "styled-components"
import { Warning, CircleNotch } from "phosphor-react"
import { colors, convertToPx } from "../../../styles/variables"
import { useFirebaseContext } from "../../../utils/auth"

import { StyledLabel, StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"

function CreateBookModal({
  bookData,
  coverColor,
  pageData,
  productData,
  setBookData,
  setShowModal,
  toast,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const [processing, setProcessing] = useState(false)
  const [bookTitleError, setBookTitleError] = useState({
    show: false,
    msg: "",
  })

  async function createNewBook() {
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
      // create a new book key (id)
      const newBookRef = firebaseDb.ref("books/").push()
      const newBookKey = newBookRef.key
      // create a new page to point the new book's pages to
      // it will just be a blank svg rect
      const newPageRef = firebaseDb.ref("pages/").push()
      const newPageKey = newPageRef.key

      // set data into the newly created page
      await newPageRef.set({
        bookId: newBookKey,
        id: newPageKey,
        svg: `<svg xmlns="http://www.w3.org/2000/svg"><rect width="${bookData.widthPixel - convertToPx(13.335)}" height="${bookData.heightPixel - convertToPx(6.35)}" fill="#fff"></rect></svg>`,
        uid: user.uid,
      })
      const pagesObject = {}

      // loop that sets page data into the new book
      // each page will refer to the newly created page
      for (let i = 1; i <= bookData.numOfPages; i++) {
        // save page to the dummy object along with page number and a reference to the page created earlier
        pagesObject[i] = {
          pageNumber: i,
          pageId: newPageKey,
        }
      }
      // write the new book into the db
      await newBookRef.set({
        "coverColor": bookData.coverColor,
        "dateCreated": new Date().valueOf(),
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
        // redirect the user to the book creation page
        navigate(`/customize/${productData.slug}/${newBookKey}`, { replace: true })
      }).catch(error => {
        toast.error("Error creating book. Please try again.")
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
              borderradius="0"
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
