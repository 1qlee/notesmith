import React, { useState } from "react"
import styled from "styled-components"
import { ArrowLeft, Warning } from "phosphor-react"
import { colors, convertToPx } from "../../../styles/variables"
import { Link, navigate } from "gatsby"
import { useFirebaseContext } from "../../../utils/auth"
import Loading from "../../../assets/loading.svg"
import notebooks from "../../../data/notebooks.json"

import { StyledLabel, StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { BookRadio } from "../Books/BookComponents"
import { Flexbox } from "../../layout/Flexbox"
import Tag from "../../ui/Tag"
import Progress from "../../ui/Progress"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

const StepBackButton = styled.button`
  border: none;
  background-color: transparent;
  color: ${colors.link.normal};
`

function NewBookModal({
  bookData,
  setShowModal,
  setBookData,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const [step, setStep] = useState(0)
  const [bookTitleError, setBookTitleError] = useState({
    show: false,
    msg: "",
  })
  const [processing, setProcessing] = useState(false)
  const [pageData, setPageData] = useState({
    pageWidth: bookData.width - convertToPx(12.7),
    pageHeight: bookData.height - convertToPx(6.35),
  })

  // creating a new book in the db
  function createNewBook() {
    setProcessing(true)
    if (!bookData.title || bookData.title.trim().length === 0) {
      setProcessing(false)
      setBookTitleError({
        show: true,
        msg: "Please enter a title."
      })
    }
    else {
      // create a new book key (id)
      const newBookRef = firebaseDb.ref("books/").push()
      const newBookKey = newBookRef.key
      const pagesObject = {}
      // create pages for the new book
      for (let i = 1; i <= bookData.numOfPages; i++) {
        // create a new page key (id)
        const newPageRef = firebaseDb.ref("pages/").push()
        const newPageKey = newPageRef.key
        let newPageSvg = null
        // keep track of each page in this object - it will be used later to set pages in 'books'
        pagesObject[`${newPageKey}`] = true
        // svg for a blank page
        newPageSvg = `<svg id="page-${i}" xmlns="http://www.w3.org/2000/svg"><rect width="${bookData.width}" height="${bookData.height}" fill="#fff"></rect></svg>`
        // write the new page into the db
        newPageRef.set({
          "date_created": new Date().valueOf(),
          "id": newPageKey,
          "size": bookData.size,
          "bookId": newBookKey,
          "uid": user.uid,
          "pageNumber": i,
          "svg": newPageSvg,
          "width": bookData.width,
          "height": bookData.height,
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
        setProcessing(false)
        // afterwards, log that book id into 'users/userId/books/bookId'
        firebaseDb.ref(`users/${user.uid}/books`).child(newBookKey).set(true)
        // redirect the user to the book creation page
        navigate(`/customize/notebook/${newBookKey}`)
      }).catch(error => {
        console.log("error writing book to the database")
      })
    }
  }

  function handleClick(data, step) {
    setBookData(data)
    setStep(step)
  }

  function generateBookTypes() {
    let booksArray = []

    for (const book in notebooks) {
      booksArray.push(
        <BookRadio
          onClick={() => handleClick({
            ...bookData,
            name: notebooks[book].name,
            slug: notebooks[book].slug,
            numOfPages: notebooks[book].numOfPages,
          }, 1)}
          isActive={bookData.name === notebooks[book].name}
          key={notebooks[book].name}
        >
          <Flexbox
            flex="flex"
            borderradius="0.25rem"
            justifycontent="space-between"
            width="100%"
          >
            <Tag
              fontsize="0.75rem"
              fontfamily="Inter, Helvetica, Tahoma, sans-serif"
              fontweight="700"
              backgroundcolor={colors.gray.threeHundred}
              color={colors.gray.eightHundred}
              padding="0.25rem 0.5rem"
              margin="0 0 0.25rem"
            >
              {notebooks[book].name}
            </Tag>
            <Content
              paragraphfontsize="1.25rem"
              paragraphmarginbottom="0"
              paragraphtextalign="right"
              paragraphlineheight="1"
            >
              <p>${notebooks[book].price}</p>
            </Content>
          </Flexbox>
          <Content
            paragraphfontsize="0.875rem"
            padding="0 0 0 0.5rem"
          >
            <p>This notebook has {notebooks[book].numOfPages} total pages.</p>
          </Content>
        </BookRadio>
      )
    }

    return booksArray
  }

  return (
    <Modal
      width="300px"
      setShowModal={setShowModal}
    >
      <ModalHeader>Create a new book</ModalHeader>
      <ModalContent
        backgroundcolor={colors.white}
      >
        <Content
          h3fontsize="1.25rem"
          margin="0 0 1rem 0"
        >
          <p>Enter a title for your new notebook and then select additional configurations below.</p>
        </Content>
        <Content
          margin="0 0 1rem"
          headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
          h3fontsize="0.75rem"
          h3margin="0 0 0.5rem 0"
        >
          <form
            id="new-book-form"
            autoComplete="off"
            onSubmit={e => e.preventDefault()}
          >
            <h3>Title</h3>
            <StyledInput
              borderradius="0.25rem"
              type="text"
              id="new-book-title"
              name="new-book-title"
              autocomplete="false"
              placeholder="Enter a title"
              onChange={e => setBookData({
                ...bookData,
                title: e.target.value.trim(),
              })}
              onFocus={() => setBookTitleError({
                show: false,
                msg: "",
              })}
            />
            {bookTitleError.show && (
              <ErrorLine color={colors.red.sixHundred}>
                <Icon>
                  <Warning weight="fill" color={colors.red.sixHundred} size={18} />
                </Icon>
                <span>{bookTitleError.msg}</span>
              </ErrorLine>
            )}
          </form>
        </Content>
        {step === 0 && (
          <Content
            margin="0 0 1rem"
            headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
            h3fontsize="0.75rem"
            h3margin="0 0 0.5rem 0"
          >
            <h3>Type of book</h3>
            {generateBookTypes()}
          </Content>
        )}
        {step === 1 && (
          <Content
            margin="0 0 1rem"
            headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
            h3fontsize="0.75rem"
            h3margin="0 0 0.5rem 0"
          >
            <h3>Size</h3>
            {notebooks[bookData.slug].sizes.map(size => (
              <BookRadio
                onClick={() => handleClick({
                  ...bookData,
                  size: size.name
                }, 2)}
                isActive={bookData.size === size.name}
                key={size.name}
              >
                <Flexbox
                  flex="flex"
                  alignitems="center"
                  borderradius="0.25rem"
                  justifycontent="space-between"
                  width="100%"
                >
                  <Tag
                    fontsize="0.75rem"
                    fontfamily="Inter, Helvetica, Tahoma, sans-serif"
                    fontweight="700"
                    backgroundcolor={colors.gray.threeHundred}
                    color={colors.gray.eightHundred}
                    padding="0.25rem 0.5rem"
                    margin="0 0.5rem 0 0"
                  >
                    {size.name}
                  </Tag>
                  <Content
                    h3margin="0"
                    h3fontsize="1rem"
                    paragraphmarginbottom="0"
                  >
                    <p>{`${size.width}" x ${size.height}"`}</p>
                  </Content>
                </Flexbox>
              </BookRadio>
            ))}
          </Content>
        )}
        {step === 2 && (
          <Content
            margin="0 0 1rem"
            headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
            h3fontsize="0.75rem"
            h3margin="0 0 0.5rem 0"
          >
            <h3>Cover color</h3>
          </Content>
        )}
        <Flexbox
          flex="flex"
          alignitems="center"
        >
          {step > 0 && (
            <Button
              backgroundcolor="transparent"
              padding="0"
              margin="0 0.5rem 0 0"
              onClick={() => setStep(step - 1)}
            >
              <Icon>
                <ArrowLeft weight="regular" color={colors.gray.sixHundred} size={16} />
              </Icon>
            </Button>
          )}
          <Progress
            barcolor={colors.gray.sixHundred}
            completion={parseFloat(step / 3 * 100)}
            margin="0"
            wrappercolor={colors.gray.threeHundred}
          />
        </Flexbox>
      </ModalContent>
      <ModalFooter>
        <Button
          backgroundcolor={colors.primary.sixHundred}
          className={processing ? "is-loading" : null}
          color={colors.white}
          disabled={processing || !bookData.title || bookData.title.trim().length === 0}
          form="new-book-form"
          onClick={e => createNewBook()}
          padding="1rem"
          width="100%"
        >
          {processing ? (
            <Loading height="1rem" width="100%" />
          ) : (
            "Create book"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default NewBookModal
