import React, { useEffect, useState } from "react"
import { colors, spacing } from "../../styles/variables"
import { navigate, Link } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { Circle, CheckCircle, Warning } from "phosphor-react"

import { Book } from "./Books/BookComponents"
import { Flexbox, FlexboxButtons } from "../layout/Flexbox"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import { SectionMain, SectionApp, SectionAppContent } from "../layout/Section"
import { Select } from "../ui/Select"
import { StyledInput, StyledRadio, StyledLabel, StyledFieldset, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import BooksContainer from "./Books/BooksContainer"
import Content from "../Content"
import ContextMenu from "../ui/ContextMenu"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import SEO from "../layout/Seo"
import Sidebar from "../ui/Sidebar"

const Books = () => {
  const isBrowser = typeof window !== "undefined"
  const { user, firebaseDb } = useFirebaseContext()
  const { uid } = user
  const booksRef = firebaseDb.ref("books/")
  const userBooksRef = firebaseDb.ref(`users/${uid}/books`)
  const pagesRef = firebaseDb.ref("pages/")
  const [loading, setLoading] = useState(true)
  const [bookTitle, setBookTitle] = useState("")
  const [bookSize, setBookSize] = useState(null)
  const [userBooks, setUserBooks] = useState()
  const [userBooksSnapshot, setUserBooksSnapshot] = useState()
  const [bookToBeDeleted, setBookToBeDeleted] = useState()
  const [dbError, setDbError] = useState({
    msg: "",
    color: colors.red.sixHundred,
  })
  const [showModal, setShowModal] = useState({
    show: false,
    type: "createbook",
  })
  const [sortMethod, setSortMethod] = useState({
    value: getLocalStorage("sortValue"),
    method: getLocalStorage("sortMethod"),
    order: getLocalStorage("sortOrder"),
  })

  useEffect(() => {
    function getUserBooks() {
      // if there is no preference, set A to Z as default
      if (!getLocalStorage("sortMethod") || !getLocalStorage("sortOrder") || !getLocalStorage("sortValue")) {
        setLocalStorage("sortValue", "Alphabetical")
        setLocalStorage("sortMethod", "title")
        setLocalStorage("sortOrder", "ascending")
      }

      // get all books that match the user's uid
      booksRef.orderByChild('uid').equalTo(uid).on("value", snapshot => {
        const booksArray = []
        // push them into an array const
        snapshot.forEach(child => {
          booksArray.push(child.val())
        })

        // make sure the books get rendered in the correct sorting prefence (set by user)
        setUserBooks(
          sortBooks(
            getLocalStorage("sortMethod"),
            getLocalStorage("sortOrder"),
            getLocalStorage("sortValue"),
            booksArray
          )
        )

        // remove loading ui
        setLoading(false)
      })
    }

    getUserBooks()
  }, [])

  // check if we're in the browser and set local storage
  function setLocalStorage(key, data) {
    return isBrowser && window.localStorage.setItem(key, data)
  }

  // check if we're in the browser and get local storage
  function getLocalStorage(key, data) {
    return isBrowser && window.localStorage.getItem(key, data)
  }

  function handleShowModal(show, type) {
    setShowModal({
      show: show,
      type: type,
    })
  }

  function handleBookDelete(book) {
    handleShowModal(true, "deletebook")
    setBookToBeDeleted(book)
  }

  // creating a new book in the db
  function handleNewBookFormSubmit(e) {
    e.preventDefault()
    // create a new book key (id)
    const newBookRef = booksRef.push()
    const newBookKey = newBookRef.key
    const pagesObject = {}
    // create pages for the new book - loop 48 times for 48 pages
    for (let i = 1; i < 49; i++) {
      // create a new page key (id)
      const newPageRef = pagesRef.push()
      const newPageKey = newPageRef.key
      const newPageSvg = null
      // keep track of each page in this object - it will be used later to set pages in 'books'
      pagesObject[`${newPageKey}`] = true
      // svg for a blank page
      switch(bookSize) {
        case "Small":
          newPageSvg = "<rect x='-1' y='-1' width='336' height='528' fill='#fff'></rect>"
          break
        case "Medium":
          newPageSvg = "<g style='pointer-events:none'><rect x='-1' y='-1' width='528' height='816' fill='#fff'></rect></g>"
          break
        case "Large":
          newPageSvg = "<rect x='-1' y='-1' width='672' height='960' fill='#fff'></rect>"
          break
        default:
          newPageSvg = "<rect x='-1' y='-1' width='528' height='816' fill='#fff'></rect>"
      }

      // write the new page into the db
      newPageRef.set({
        "date_created": new Date().valueOf(),
        "id": newPageKey,
        "size": bookSize,
        "bookId": newBookKey,
        "uid": uid,
        "pageNumber": i,
        "svg": newPageSvg
      })
    }
    // write the new book into the db
    newBookRef.set({
      "date_created": new Date().valueOf(),
      "id": newBookKey,
      "size": bookSize,
      "title": bookTitle,
      "uid": uid,
      "pages": pagesObject
    }).then(() => {
      // afterwards, log that book id into 'users/userId/books/bookId'
      userBooksRef.child(newBookKey).set(true)
      // redirect the user to the book creation page
      navigate(`/app/create/${newBookKey}`)
    })
  }

  // sort books client-side
  function sortBooks(method, order, value, books) {
    // store parameters in localStorage to save user's preference
    setLocalStorage("sortValue", value)
    setLocalStorage("sortOrder", order)
    setLocalStorage("sortMethod", method)
    let copiedArray = null
    // sort by title
    if (method === "title") {
      // if books parameter exists, that means we are on the initial load
      // else we'll just be changing userBooks as defined in useState
      books ?
        copiedArray = books.sort((a, b) => a.title.localeCompare(b.title)) :
        copiedArray = userBooks.sort((a, b) => a.title.localeCompare(b.title))

      // have to create a new array so the components knows state has changed
      const sortedBooksArray = Array.from(copiedArray)

      // logic to check for descending or ascending order
      if (order === "descending") {
        // if books parameter exists, just return the value of the array
        if (books) {
          return sortedBooksArray.reverse()
        }
        // else we can set userBooks state
        else {
          setUserBooks(sortedBooksArray.reverse())
        }
      }
      // ascending order
      else {
        // if books parameter exists, just return the value of the array
        if (books) {
          return sortedBooksArray
        }
        // else we can set userBooks state
        else {
          setUserBooks(sortedBooksArray)
        }
      }
    }

    // sort by date created
    if (method === "date_created") {
      // if books parameter exists, that means we are on the initial load
      // else we'll just be changing userBooks as defined in useState
      books ?
        copiedArray = books.sort((a, b) => a.date_created - b.date_created) :
        copiedArray = userBooks.sort((a, b) => a.date_created - b.date_created)
      // have to create a new array so the components knows state has changed

      const sortedBooksArray = Array.from(copiedArray)
      // logic to check for descending or ascending order

      if (order === "descending") {
        // if books parameter exists, just return the value of the array
        if (books) {
          return sortedBooksArray.reverse()
        }
        // else we can set userBooks state
        else {
          setUserBooks(sortedBooksArray.reverse())
        }
      }
      else {
        // if books parameter exists, just return the value of the array
        if (books) {
          return sortedBooksArray
        }
        // else we can set userBooks state
        else {
          setUserBooks(sortedBooksArray)
        }
      }
    }
  }

  function renameBook(oldBookTitle, newBookTitle, bookId, cb) {
    const bookData = {
      title: newBookTitle
    }
    const updates = {}
    updates[`/books/${bookId}/title`] = newBookTitle

    firebaseDb.ref().update(updates, error => {
      if (error) {
        console.log("Error occurred when updating book title.")
      }
    })
  }

  function deleteBook(book) {
    // remove the book from 'books'
    booksRef.child(book.id).remove().then(() => {
      // remove the book from user's 'books'
      userBooksRef.child(book.id).remove()
      // delete all pages that belong to this bookId
      pagesRef.orderByChild('bookId').equalTo(book.id).once("value").then(snapshot => {
        snapshot.forEach(child => {
          pagesRef.child(child.key).remove()
        })
      })
    }).catch(error => {
      console.log(error)
    })
    // hide modal
    handleShowModal(false, "deletebook")
  }

  function duplicateBook(book) {
    // create a new key
    const newBookRef = booksRef.push()
    const newBookKey = newBookRef.key
    // keep track of each page within this object
    const pagesObject = {}

    // get all pages for this bookId
    pagesRef.orderByChild("bookId").equalTo(book.id).once("value").then(snapshot => {
      snapshot.forEach(child => {
        // create a new page key (id)
        const newPageRef = pagesRef.push()
        const newPageKey = newPageRef.key
        pagesObject[`${newPageKey}`] = true

        // write the new page into the db
        newPageRef.set({
          "date_created": new Date().valueOf(),
          "id": newPageKey,
          "size": child.val().size,
          "bookId": newBookKey,
          "uid": uid,
          "pageNumber": child.val().pageNumber
        })
      })
    }).then(() => {
      // write the duplicated book into the db
      newBookRef.set({
        "date_created": new Date().valueOf(),
        "size": book.size,
        "title": `${book.title} (Copy)`,
        "id": newBookKey,
        "uid": uid,
        "pages": pagesObject
      }).then(() => {
        // afterwards, log that book id into 'users/userId/books/bookId'
        userBooksRef.child(newBookKey).set(true)
      })
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <Layout>
      <SEO title="Dashboard" />
      <SectionMain className="has-no-padding has-max-height">
        <SectionApp>
          <Sidebar />
          <SectionAppContent>
            <Flexbox
              flex="flex"
              alignitems="center"
              justifyContent="flex-start"
              padding="1rem 0"
            >
              <Select
                initialDbValue={getLocalStorage("sortMethod")}
                initialOption={getLocalStorage("sortValue")}
                initialSortOrder={getLocalStorage("sortOrder")}
                mainFunction={sortBooks}
              />
              <Button
                color={colors.white}
                backgroundcolor={colors.primary.sixHundred}
                borderRadius="0.25rem"
                onClick={() => handleShowModal(true, "createbook")}
              >
                New book
              </Button>
            </Flexbox>
            <BooksContainer
              userBooks={userBooks}
              renameBook={renameBook}
              duplicateBook={duplicateBook}
              handleBookDelete={handleBookDelete}
            />
          </SectionAppContent>
        </SectionApp>
      </SectionMain>
      {showModal.show && (
        <Modal setShowModal={setShowModal}>
          {showModal.type === "createbook" ? (
            <>
              <ModalHeader>
                <h5>Enter book information</h5>
              </ModalHeader>
              <ModalContent>
                <form id="new-book-form" name="new-book-form" onSubmit={e => handleNewBookFormSubmit(e)}>
                  <StyledFieldset
                    className="is-vertical"
                    margin="0 0 1rem"
                  >
                    <StyledLabel>Title</StyledLabel>
                    <StyledInput
                      borderRadius="0.25rem"
                      type="text"
                      id="new-book-title"
                      name="new-book-title"
                      autocomplete="false"
                      onChange={e => {
                        setBookTitle(e.currentTarget.value)
                        setDbError({
                          msg: "",
                        })
                      }}
                    />
                    {dbError.msg && (
                      <ErrorLine color={dbError.color}>
                        <Icon>
                          <Warning weight="fill" color={dbError.color} size={18} />
                        </Icon>
                        <span>{dbError.msg}</span>
                      </ErrorLine>
                    )}
                  </StyledFieldset>
                  <StyledFieldset
                    className="is-vertical"
                    margin="0 0 1rem"
                  >
                    <StyledLabel>Sizes</StyledLabel>
                    <Flexbox
                      flex="flex"
                      alignitems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <StyledRadio
                        onChange={e => setBookSize(e.target.value)}
                      >
                        <input
                          id="size-small"
                          name="size"
                          type="radio"
                          value="Small"
                        />
                        <label htmlFor="size-small" tabIndex={-1}>
                          <div className="radio-header">
                            <span>Small</span>
                            {bookSize === "Small" ? (
                              <Icon>
                                <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                              </Icon>
                            ) : (
                              <Icon>
                                <Circle weight="regular" color={colors.link.normal} size={18} />
                              </Icon>
                            )}
                          </div>
                          <div className="radio-content">
                            <p>48 pages</p>
                            <p>3 x 5 inches</p>
                          </div>
                        </label>
                      </StyledRadio>
                      <StyledRadio
                        onChange={e => setBookSize(e.target.value)}
                      >
                        <input
                          id="size-medium"
                          name="size"
                          type="radio"
                          value="Medium"
                        />
                        <label htmlFor="size-medium" tabIndex={-1}>
                          <div className="radio-header">
                            <span>Medium</span>
                            {bookSize === "Medium" ? (
                              <Icon>
                                <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                              </Icon>
                            ) : (
                              <Icon>
                                <Circle weight="regular" color={colors.link.normal} size={18} />
                              </Icon>
                            )}
                          </div>
                          <div className="radio-content">
                            <p>48 pages</p>
                            <p>5 x 7 inches</p>
                          </div>
                        </label>
                      </StyledRadio>
                      <StyledRadio
                        onChange={e => setBookSize(e.target.value)}
                      >
                        <input
                          id="size-large"
                          name="size"
                          type="radio"
                          value="Large"
                        />
                        <label htmlFor="size-large" tabIndex={-1}>
                          <div className="radio-header">
                            <span>Large</span>
                            {bookSize === "Large" ? (
                              <Icon>
                                <CheckCircle weight="duotone" color={colors.link.normal} size={18} />
                              </Icon>
                            ) : (
                              <Icon>
                                <Circle weight="regular" color={colors.link.normal} size={18} />
                              </Icon>
                            )}
                          </div>
                          <div className="radio-content">
                            <p>48 pages</p>
                            <p>7 x 10 inches</p>
                          </div>
                        </label>
                      </StyledRadio>
                    </Flexbox>
                  </StyledFieldset>
                </form>
              </ModalContent>
              <ModalFooter>
                <Button
                  backgroundcolor={colors.primary.sixHundred}
                  className="is-medium"
                  color={colors.white}
                  width="100%"
                  disabled={bookTitle.length === 0 || !bookSize}
                  form="new-book-form"
                  type="submit"
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                <h5>Delete book</h5>
              </ModalHeader>
              <ModalContent>
                <p>Are you sure you want to delete <b>{bookToBeDeleted.title}</b>?</p>
              </ModalContent>
              <ModalFooter>
                <Flexbox
                  flex="flex"
                  justifyContent="flex-end"
                  alignitems="center"
                >
                  <FlexboxButtons>
                    <Button
                      backgroundcolor={colors.white}
                      color={colors.gray.nineHundred}
                      onClick={() => handleShowModal(false, "deletebook")}
                    >
                      Cancel
                    </Button>
                    <Button
                      backgroundcolor={colors.red.sixHundred}
                      color={colors.white}
                      onClick={() => deleteBook(bookToBeDeleted)}
                    >
                      Delete
                    </Button>
                  </FlexboxButtons>
                </Flexbox>
              </ModalFooter>
            </>
          )}
        </Modal>
      )}
    </Layout>
  )
}

export default Books
