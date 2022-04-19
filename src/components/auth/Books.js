import React, { useEffect, useState } from "react"
import { colors } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { Warning } from "phosphor-react"
import { jsPDF as createPdf } from 'jspdf'
import Loading from "../../assets/loading.svg"
import 'svg2pdf.js'

import { BookRadio } from "./books/BookComponents"
import { Flexbox } from "../layout/Flexbox"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import { SectionMain, SectionApp, SectionAppContent, SectionAppWorkspace } from "../layout/Section"
import { Select } from "../ui/Select"
import { StyledInput, StyledLabel, ErrorLine } from "../form/FormComponents"
import BooksContainer from "./books/booksContainer"
import Button from "../Button"
import Content from "../Content"
import DeleteBookModal from "./modals/DeleteBookModal"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import NewBookModal from "./modals/AppNewBookModal"
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
  const [bookData, setBookData] = useState({
    size: "",
    numOfPages: 140,
    widthPixel: 528,
    heightPixel: 816,
    widthInch: "5.5",
    heightInch: "8.5",
    title: "",
    coverColor: "",
  })
  const [userBooks, setUserBooks] = useState()
  const [bookToBeDeleted, setBookToBeDeleted] = useState()
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

    return () => {
      setLoading(false)
    }
  }, [])

  // check if we're in the browser and set local storage
  function setLocalStorage(key, data) {
    return isBrowser && window.localStorage.setItem(key, data)
  }

  // check if we're in the browser and get local storage
  function getLocalStorage(key, data) {
    return isBrowser && window.localStorage.getItem(key, data)
  }

  function handleBookDelete(book) {
    setShowModal({
      show: true,
      type: "deletebook",
    })
    setBookToBeDeleted(book)
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
    setShowModal({
      show: false,
      type: "deletebook",
    })
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
      compress: true,
    })
    const downloadBookRef = firebaseDb.ref('books/-Mo-pISGlvG2AxeVFsXz')

    downloadBookRef.once("value").then(snapshot => {
      const pages = snapshot.val().pages
      let index = 1

      console.log("initializing pdf...")
      bookPdf.deletePage(1)

      for (const page in pages) {
        const numOfPages = Object.keys(pages).length

        firebaseDb.ref(`pages/${page}`).orderByChild('pageNumber').once("value").then(snapshot => {
          const pageSvg = snapshot.val().svg
          const node = new DOMParser().parseFromString(pageSvg, 'text/html').body.firstElementChild

          console.log("adding page: ", index)
          bookPdf.addPage([139.7, 215.9], "portrait")
          bookPdf.setPage(index)

          bookPdf.svg(node, {
            x: 0,
            y: 0,
            width: 139.7,
            height: 215.9,
          }).then(() => {

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
      <Seo title="Books" />
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
                onClick={() => setShowModal({
                  show: true,
                  type: "createbook",
                })}
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
        <>
          {showModal.type === "createbook" && (
            <NewBookModal
              setShowModal={setShowModal}
              setBookData={setBookData}
              bookData={bookData}
            />
          )}
          {showModal.type === "deletebook" && (
            <DeleteBookModal
              bookToBeDeleted={bookToBeDeleted}
              deleteBook={deleteBook}
              setShowModal={setShowModal}
            />
          )}
        </>
      )}
    </Layout>
  )
}

export default Books
