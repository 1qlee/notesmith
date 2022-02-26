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
  max-height: 300px;
  overflow-y: auto;
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
        newPageSvg = {
          name: "rect",
          width: bookData.widthPixel - convertToPx(12.7),
          height: bookData.heightPixel - convertToPx(6.35),
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
        setProcessing(false)
        // redirect the user to the book creation page
        navigate(`/customize/${bookData.slug}/${newBookKey}`)
      }).catch(error => {
        console.log("error writing book to the database")
        console.error(error)
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
          h3fontsize="1.25rem"
          margin="0 0 1rem 0"
        >
          <p>We'll guide you through the creation of your new notebook using the interactive steps below.</p>
        </Content>
        {step === 0 && (
          <StepContent>
            <Content
              margin="0 0 1rem"
              headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
              h3fontsize="0.75rem"
              h3margin="0 0 0.5rem 0"
            >
              <h3>1. Type of book</h3>
              {productsData.allProductsJson.nodes.map((product, index) => (
                <BookRadio
                  onClick={() => handleClick({
                    ...product,
                    coverColor: "",
                  }, 1, index)}
                  isActive={bookData.name === product.name}
                  key={product.name}
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
                      backgroundcolor={colors.yellow.oneHundred}
                      color={colors.primary.nineHundred}
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
            </Content>
          </StepContent>
        )}
        {step === 1 && (
          <StepContent>
            <Content
              margin="0 0 1rem"
              headingfontfamily="Inter, Helvetica, Tahoma, sans-serif"
              h3fontsize="0.75rem"
              h3margin="0 0 0.5rem 0"
            >
              <h3>2. Cover color</h3>
              <Flexbox
                flex="flex"
                alignitems="center"
                borderradius="0.25rem"
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
                <p style={{textTransform: "capitalize"}}>{bookData.coverColor.replace('-', ' ')}</p>
              </Flexbox>
            </Content>
          </StepContent>
        )}
        {step === 2 && (
          <StepContent>
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
                <h3>3. Title</h3>
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
              <CircleNotch />
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
