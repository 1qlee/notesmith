import React, { useEffect, useState } from "react"
import { colors } from "../../styles/variables"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { Warning } from "phosphor-react"
import { jsPDF as createPdf } from 'jspdf'
import 'svg2pdf.js'
import Loading from "../../assets/loading.svg"

import { BookRadio } from "./Books/BookComponents"
import { Flexbox } from "../layout/Flexbox"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import { SectionMain, SectionApp, SectionAppContent, SectionAppWorkspace } from "../layout/Section"
import { Select } from "../ui/Select"
import { StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import Button from "../Button"
import BooksContainer from "./Books/BooksContainer"
import Content from "../Content"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import Seo from "../layout/Seo"
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
  const [bookData, setBookData] = useState({
    title: "",
    size: "",
    width: 0,
    height: 0,
    numOfPages: 160,
  })
  const [userBooks, setUserBooks] = useState()
  const [bookToBeDeleted, setBookToBeDeleted] = useState()
  const [dbError, setDbError] = useState({
    msg: "",
    color: colors.red.sixHundred,
  })
  const [showModal, setShowModal] = useState({
    show: false,
    type: "createbook",
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    function getUserBooks() {
      // if there is are no sort variables in localStorage, set some defaults
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

        // make sure the books get rendered in the correct sorting preference (set by user)
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
  function handleNewBookFormSubmit() {
    setProcessing(true)
    // create a new book key (id)
    const newBookRef = booksRef.push()
    const newBookKey = newBookRef.key
    const pagesObject = {}
    // create pages for the new book
    for (let i = 1; i <= bookData.numOfPages; i++) {
      // create a new page key (id)
      const newPageRef = pagesRef.push()
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
        "uid": uid,
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
      "title": bookTitle,
      "uid": uid,
    }).then(() => {
      setProcessing(false)
      // afterwards, log that book id into 'users/userId/books/bookId'
      userBooksRef.child(newBookKey).set(true)
      // redirect the user to the book creation page
      navigate(`/customize/notebook/${newBookKey}`)
    }).catch(error => {
      console.log("error writing book to the database")
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
    const updates = {}
    // update the specified book by its bookId
    // only updates the title field
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

  function downloadBookPdf() {
    const bookPdf = new createPdf({
      format: [139.7, 215.9],
    })
    const downloadBookRef = firebaseDb.ref('books/-Mo-pISGlvG2AxeVFsXz')

    downloadBookRef.once("value").then(snapshot => {
      const pages = snapshot.val().pages
      let index = 1

      // console.log("initializing pdf...")
      // bookPdf.deletePage(1)
      // bookPdf.addPage([139.7, 215.9], "portrait") // addPage expects values in millimeters
      // bookPdf.setPage(1)
      // console.log("done initializing")

      for (const page in pages) {
        const numOfPages = Object.keys(pages).length

        firebaseDb.ref(`pages/${page}`).orderByChild('pageNumber').once("value").then(snapshot => {
          const pageSvg = snapshot.val().svg
          const node = new DOMParser().parseFromString(pageSvg, 'text/html').body.firstElementChild

          bookPdf.svg(node, {
            x: 0,
            y: 0,
            width: 139.7,
            height: 215.9,
          }).then(() => {
            console.log("adding page: ", index)
            bookPdf.addPage([139.7, 215.9], "portrait")
            bookPdf.setPage(index)

            if (index === numOfPages) {
              console.log("saving pdf")
              bookPdf.save()
            }

            index++
          })
        })
      }
    })
  }

  return (
    <Layout>
      <Seo title="Dashboard" />
      <SectionMain className="has-no-padding has-max-height">
        <SectionApp>
          <Sidebar page="Books" />
          <SectionAppContent>
            <Flexbox
              flex="flex"
              alignitems="center"
              justifycontent="flex-start"
              padding="1rem 2rem"
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
                borderradius="0.25rem"
                onClick={() => handleShowModal(true, "createbook")}
              >
                New book
              </Button>
              <Button
                onClick={() => downloadBookPdf()}
              >
                Download book
              </Button>
            </Flexbox>
            <SectionAppWorkspace heightmargin="4rem">
              {loading ? (
                <Loader className="is-app" />
              ) : (
                <BooksContainer
                  userBooks={userBooks}
                  renameBook={renameBook}
                  duplicateBook={duplicateBook}
                  handleBookDelete={handleBookDelete}
                />
              )}
            </SectionAppWorkspace>
          </SectionAppContent>
        </SectionApp>
      </SectionMain>
      {showModal.show && (
        <Modal
          width="300px"
          setShowModal={setShowModal}
        >
          {showModal.type === "createbook" ? (
            <>
              <ModalContent
                backgroundcolor={colors.white}
              >
                <Content
                  h3fontsize="1.25rem"
                  margin="0 0 2rem 0"
                >
                  <h3>Create a new book</h3>
                  <p>Enter a title for your new notebook and then select a type of notebook by clicking one of the boxes below.</p>
                </Content>
                <Flexbox
                  margin="0 0 1rem"
                >
                  <StyledLabel>Title</StyledLabel>
                  <StyledInput
                    borderradius="0.25rem"
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
                </Flexbox>
                <StyledLabel>Book (select one)</StyledLabel>
                <BookRadio
                  img="https://cdn.shopify.com/s/files/1/0831/9463/products/Notebooks_Notebook_Charcoal_1024x1024@2x.png?v=1571438791"
                  title="A5 Notebook"
                  description="160 pages total"
                  price="$24"
                  size="A5"
                  width={528}
                  height={816}
                  numOfPages={160}
                  setBookData={setBookData}
                  isActive={bookData.size === "A5"}
                />
              </ModalContent>
              <ModalFooter>
                <Button
                  backgroundcolor={colors.primary.sixHundred}
                  className={processing ? "is-loading" : null}
                  color={colors.white}
                  disabled={bookTitle.length === 0 || !bookData.size || processing}
                  form="new-book-form"
                  onClick={e => handleNewBookFormSubmit()}
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
            </>
          ) : (
            <>
              <ModalContent
                backgroundcolor={colors.white}
              >
                <Content
                  h3fontsize="1.25rem"
                  margin="0 0 0 0"
                >
                  <h3>Delete this book</h3>
                  <p>Are you sure you want to delete <b>{bookToBeDeleted.title}</b>?</p>
                </Content>
              </ModalContent>
              <ModalFooter
                justifycontent="flex-end"
              >
                <Button
                  backgroundcolor={colors.gray.oneHundred}
                  boxshadow={colors.shadow.layeredSmall}
                  onClick={() => handleShowModal(false, "deletebook")}
                  margin="0 0.5rem 0 0"
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
              </ModalFooter>
            </>
          )}
        </Modal>
      )}
    </Layout>
  )
}

export default Books
