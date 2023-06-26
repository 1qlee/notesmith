import React, { useState } from "react"
import styled from "styled-components"
import { ArrowLeft, Warning, CircleNotch } from "phosphor-react"
import { colors, fonts, pageMargins } from "../../../styles/variables"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../../utils/auth"
import { ref, set, push } from "firebase/database"

import { StyledInput, ErrorLine } from "../../form/FormComponents"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { BookRadio } from "../books/BookComponents"
import { Flexbox } from "../../layout/Flexbox"
import ColorPicker from "../../shop/ColorPicker"
import Progress from "../../ui/Progress"
import Icon from "../../ui/Icon"
import Button from "../../ui/Button"
import Content from "../../ui/Content"

const StepContent = styled.div`
  min-height: 36px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 32px;
  padding: 2px;
`

function NewBookModal({
  allProducts,
  bookData,
  setShowModal,
  setBookData,
  toast,
}) {
  const { user, firebaseDb } = useFirebaseContext()
  const booksRef = ref(firebaseDb, "books/")
  const pagesRef = ref(firebaseDb, "pages/")
  const [step, setStep] = useState(0)
  const [bookTitleError, setBookTitleError] = useState({
    show: false,
    msg: "",
  })
  const [processing, setProcessing] = useState(false)
  const [selectedBook, setSelectedBook] = useState(0)
  const pageWidth = bookData.widthPixel - pageMargins.horizontal
  const pageHeight = bookData.heightPixel - pageMargins.vertical

  // creating a new book in the db
  async function createNewBook(e) {
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
      const newBookKey = push(booksRef).key
      // create a new page to point the new book's pages to
      // it will just be a blank svg rect
      const newPageKey = push(pagesRef).key

      // set data into the newly created page
      await set(ref(firebaseDb, `pages/${newPageKey}`), {
        bookId: newBookKey,
        id: newPageKey,
        svg: `<svg><rect width="${pageWidth}" height="${pageHeight}" fill="#fff"></rect></svg>`,
        uid: user.uid,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
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
      await set(ref(firebaseDb, `books/${newBookKey}`), { 
        coverColor: bookData.coverColor,
        dateCreated: new Date().valueOf(),
        heightPixel: bookData.heightPixel,
        heightInch: bookData.heightInch,
        id: newBookKey,
        name: bookData.name,
        numOfPages: bookData.numOfPages,
        pages: pagesArray,
        size: bookData.size,
        title: bookData.title,
        uid: user.uid,
        slug: bookData.slug,
        widthPixel: bookData.widthPixel,
        widthInch: bookData.widthInch,
      }).then(async () => {
        // afterwards, log that book id into 'users/userId/books/bookId'
        await set(ref(firebaseDb, `users/${user.uid}/books/${newBookKey}`), true)
        setProcessing(false)
        // redirect the user to the book creation page
        navigate(`/customize/${bookData.slug}/${newBookKey}`)
      }).catch(() => {
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
      setShowModal={setShowModal}
    >
      <ModalHeader>Create a new book</ModalHeader>
      <ModalContent
        backgroundcolor={colors.white}
      >
        <Content
          h3fontsize="0.75rem"
          h3margin="0"
          h3fontweight="700"
          headingfontfamily={fonts.secondary}
          margin="0 0 8px 0"
          paragraphmargin="0 0 32px"
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
            {allProducts.nodes.map((product, index) => (
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
                  justifycontent="space-between"
                  width="100%"
                >
                  <Content
                    h5margin="0 0 4px"
                    h5fontweight="700"
                  >
                    <h5>{product.name}</h5>
                  </Content>
                  <Content
                    paragraphfontsize="1.25rem"
                    paragraphmargin="0"
                    paragraphtextalign="right"
                    paragraphlineheight="1"
                  >
                    <p>${product.price / 100}</p>
                  </Content>
                </Flexbox>
                <Content
                  paragraphfontsize="0.875rem"
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
              padding="4px 0 0 4px"
              width="100%"
            >
              <ColorPicker
                data={allProducts.nodes[selectedBook].colors}
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
              id="create-book-form"
              onSubmit={createNewBook}
            >
              <StyledInput
                type="text"
                id="new-book-title"
                name="new-book-title"
                autocomplete="false"
                placeholder="Name your new book"
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
            barcolor={colors.gray.nineHundred}
            completion={parseFloat(step / 3 * 100)}
            margin="0"
            wrappercolor={colors.gray.threeHundred}
          />
        </Flexbox>
      </ModalContent>
      <ModalFooter>
        <Button
          backgroundcolor={colors.gray.nineHundred}
          className={processing ? "is-loading" : null}
          color={colors.gray.oneHundred}
          disabled={processing || !bookData.title || bookData.title.trim().length === 0 || step < 2}
          onClick={e => createNewBook()}
          padding="1rem"
          type="submit"
          value="Submit"
          form="create-book-form"
          width="100%"
        >
          {processing ? (
            <Icon>
              <CircleNotch size="1rem" />
            </Icon>
          ) : (
            <span>Submit</span>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default NewBookModal
