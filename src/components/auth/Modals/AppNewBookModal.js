import { ArrowLeft, Warning, CircleNotch } from "phosphor-react"
import { colors, convertToPx } from "../../../styles/variables"
import { navigate, graphql, useStaticQuery } from "gatsby"
import { useFirebaseContext } from "../../../utils/auth"
import React, { useState } from "react"
import styled from "styled-components"

import { StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { BookRadio } from "../books/BookComponents"
import { Flexbox } from "../../layout/Flexbox"
import ColorPicker from "../../shop/ColorPicker"
import Tag from "../../ui/Tag"
import Progress from "../../ui/Progress"
import Icon from "../../Icon"
import Button from "../../Button"
import Content from "../../Content"

const StepContent = styled.div`
  min-height: 32px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
`

function NewBookModal({
  bookData,
  setShowModal,
  setBookData,
  toast,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const [step, setStep] = useState(0)
  const [bookTitleError, setBookTitleError] = useState({
    show: false,
    msg: "",
  })
  const [processing, setProcessing] = useState(false)
  const [selectedBook, setSelectedBook] = useState(0)
  const productsData = useStaticQuery(graphql`
    query NewBookProductQuery {
      allProductsJson {
        nodes {
          camelName
          category
          description
          heightInch
          heightPixel
          name
          numOfPages
          paperColor
          paperTooth
          paperWeight
          price
          size
          slug
          stripePriceId
          widthInch
          widthPixel
          colors {
            name
            hex
            slug
          }
        }
      }
    }
  `)

  // creating a new book in the db
  async function createNewBook() {
    setProcessing(true)
    // check to see if title is empty
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
      const pagesArray = []

      // loop that sets page data into the new book
      // each page will refer to the newly created page
      for (let i = 0; i < bookData.numOfPages; i++) {
        // save page to the dummy object along with page number and a reference to the page created earlier
        pagesArray.push({
          pageNumber: i + 1,
          pageId: newPageKey,
        })
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
        "pages": pagesArray,
        "size": bookData.size,
        "title": bookData.title,
        "uid": user.uid,
        "slug": bookData.slug,
        "widthPixel": bookData.widthPixel,
        "widthInch": bookData.widthInch,
      }).then(() => {
        // afterwards, log that book id into 'users/userId/books/bookId'
        firebaseDb.ref(`users/${user.uid}/books`).child(newBookKey).set(true)
        setProcessing(false)
        // redirect the user to the book creation page
        navigate(`/customize/${bookData.slug}/${newBookKey}`)
      }).catch(error => {
        toast.error("Error creating book. Please try again.")
        setShowModal({
          show: false,
          type: "createbook",
        })
      })
    }
  }


  function handleClick(data, step, productNumber) {
    setBookData(data)
    setStep(step)

    if (productNumber) {
      setSelectedBook(productNumber)
    }
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
          h3fontsize="0.75rem"
          h3margin="0"
          headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
          margin="0 0 0.5rem 0"
          paragraphmarginbottom="1rem"
        >
          <p>We'll guide you through the creation of your new notebook using the interactive steps below.</p>
          {step === 0 && (
            <h3>Select type of book</h3>
          )}
          {step === 1 && (
            <h3>Select cover color</h3>
          )}
          {step === 2 && (
            <h3>Enter a title</h3>
          )}
        </Content>
        {step === 0 && (
          <StepContent>
            {productsData.allProductsJson.nodes.map((product, index) => (
              <BookRadio
                onClick={() => handleClick({
                  ...product,
                  coverColor: "",
                }, 1, index)}
                isActive={bookData.name === product.name}
                className={index === 0 && "has-border-top"}
                key={product.name}
              >
                <Flexbox
                  flex="flex"
                  justifycontent="space-between"
                  width="100%"
                >
                  <Tag
                    fontsize="0.75rem"
                    fontfamily="Inter, Helvetica, Tahoma, sans-serif"
                    fontweight="700"
                    backgroundcolor={colors.primary.oneHundred}
                    color={colors.primary.nineHundred}
                    boxshadow="none"
                    padding="0.25rem 0.5rem"
                    margin="0 0 0.25rem"
                  >
                    {product.name}
                  </Tag>
                  <Content
                    paragraphfontsize="1.25rem"
                    paragraphmarginbottom="0"
                    paragraphtextalign="right"
                    paragraphlineheight="1"
                  >
                    <p>${product.price / 100}</p>
                  </Content>
                </Flexbox>
                <Content
                  paragraphfontsize="0.875rem"
                  padding="0 0 0 0.5rem"
                >
                  <p>This notebook has {product.numOfPages} total pages.</p>
                </Content>
              </BookRadio>
            ))}
          </StepContent>
        )}
        {step === 1 && (
          <StepContent>
            <Flexbox
              flex="flex"
              alignitems="center"
              margin="0.25rem 0 0"
              justifycontent="space-between"
              width="100%"
            >
              <ColorPicker
                data={productsData.allProductsJson.nodes[selectedBook].colors}
                selectedColor={bookData.coverColor}
                cbFunction={color => handleClick({
                  ...bookData,
                  coverColor: color,
                }, 2, )}
              />
            </Flexbox>
          </StepContent>
        )}
        {step === 2 && (
          <StepContent>
            <form
              id="new-book-form"
              autoComplete="off"
              onSubmit={e => e.preventDefault()}
            >
              <StyledInput
                borderradius="0"
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
          </StepContent>
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
            barcolor={colors.primary.threeHundred}
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
          color={colors.primary.white}
          disabled={processing || !bookData.title || bookData.title.trim().length === 0 || step < 2}
          form="new-book-form"
          onClick={e => createNewBook()}
          padding="1rem"
          width="100%"
        >
          {processing ? (
            <Icon>
              <CircleNotch size="1rem" />
            </Icon>
          ) : (
            "Create book"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default NewBookModal
