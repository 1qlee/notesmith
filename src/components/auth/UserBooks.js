import React, { useEffect, useState } from "react"
import { colors, fonts } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { jsPDF as createPdf } from 'jspdf'
import { ToastContainer, toast } from 'react-toastify'
import 'svg2pdf.js'

import { Flexbox } from "../layout/Flexbox"
import AuthLayout from "./components/AuthLayout"
import BooksContainer from "./books/BooksContainer"
import Button from "../ui/Button"
import DeleteBookModal from "./modals/DeleteBookModal"
import Layout from "../layout/Layout"
import Loader from "../misc/Loader"
import NewBookModal from "./modals/AppNewBookModal"
import Seo from "../layout/Seo"

const UserBooks = () => {
  const isBrowser = typeof window !== "undefined"
  const { loading, user, firebaseDb } = useFirebaseContext()
  const { uid } = user
  const booksRef = firebaseDb.ref("books/")
  const userBooksRef = firebaseDb.ref(`users/${uid}/books`)
  const pagesRef = firebaseDb.ref("pages/")
  const [processing, setProcessing] = useState(true)
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
  const [userBooks, setUserBooks] = useState([])
  const [bookToBeDeleted, setBookToBeDeleted] = useState()
  const [showModal, setShowModal] = useState({
    show: false,
    type: "createbook",
  })

  useEffect(() => {
    async function getUserBooks() {
      setProcessing(true)
      // if there are no sort variables in localStorage, set some defaults
      if (!getLocalStorage("sortMethod") || !getLocalStorage("sortOrder") || !getLocalStorage("sortValue")) {
        setLocalStorage("sortValue", "Alphabetical")
        setLocalStorage("sortMethod", "title")
        setLocalStorage("sortOrder", "ascending")
      }

      // get all books that match the user's uid
      await booksRef.orderByChild('uid').equalTo(uid).on("value", snapshot => {
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
        setProcessing(false)
      })
    }

    if (!loading) {
      getUserBooks()
    }

  }, [loading, user])

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
    if (method === "dateCreated") {
      // if books parameter exists, that means we are on the initial load
      // else we'll just be changing userBooks as defined in useState
      books ?
        copiedArray = books.sort((a, b) => a.dateCreated - b.dateCreated) :
        copiedArray = userBooks.sort((a, b) => a.dateCreated - b.dateCreated)
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

  function renameBook(newBookTitle, bookId) {
    const updates = {}
    // update the specified book by its bookId
    // only updates the title field
    updates[`/books/${bookId}/title`] = newBookTitle

    firebaseDb.ref().update(updates, error => {
      if (error) {
        toast.error("Failed to update book title.")
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
      toast.error("Failed to delete book.")
    })
    // hide modal
    setShowModal({
      show: false,
      type: "deletebook",
    })
  }

  async function duplicateBook(book) {
    // create a new key
    const newBookRef = booksRef.push()
    const newBookKey = newBookRef.key
    // keep track of each page within this object
    const pagesObject = {}

    // get all pages for this bookId
    await pagesRef.orderByChild("bookId").equalTo(book.id).once("value").then(snapshot => {
      snapshot.forEach(child => {
        const page = child.val()
        // create a new page key (id)
        const newPageRef = pagesRef.push()
        const newPageKey = newPageRef.key
        // creating key:value pairs for old page id to new page id
        pagesObject[page.id] = newPageKey

        // write the new page into the db
        newPageRef.set({
          "bookId": newBookKey,
          "svg": page.svg,
          "id": newPageKey,
          "uid": uid,
        })
      })
    }).then(() => {
      const pagesArray = []

      for (let i = 0; i < book.pages.length; i++) {
        pagesArray.push({
          pageId: pagesObject[book.pages[i].pageId],
          pageNumber: book.pages[i].pageNumber,
        })
      }

      // write the duplicated book into the db
      newBookRef.set({
        "coverColor": book.coverColor,
        "dateCreated": new Date().valueOf(),
        "heightInch": book.heightInch,
        "heightPixel": book.heightPixel,
        "id": newBookKey,
        "name": book.name,
        "numOfPages": book.numOfPages,
        "pages": pagesArray,
        "size": book.size,
        "slug": book.slug,
        "title": `${book.title} (Copy)`,
        "uid": uid,
        "widthInch": book.widthInch,
        "widthPixel": book.widthPixel,
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
    let pageNum = 1

    downloadBookRef.once("value").then(snapshot => {
      const pages = snapshot.val().pages

      console.log("initializing pdf...")
      bookPdf.deletePage(1)

      for (const page in pages) {
        const numOfPages = Object.keys(pages).length

        firebaseDb.ref(`pages/${page}`).orderByChild('pageNumber').once("value").then(snapshot => {
          const pageSvg = snapshot.val().svg
          const node = new DOMParser().parseFromString(pageSvg, 'text/html').body.firstElementChild

          console.log("adding page: ", pageNum)
          bookPdf.addPage([139.7, 215.9], "portrait")
          bookPdf.setPage(pageNum)

          bookPdf.svg(node, {
            x: 0,
            y: 0,
            width: 139.7,
            height: 215.9,
          }).then(() => {

            if (pageNum === numOfPages) {
              console.log("saving pdf")
              bookPdf.save()
            }

            pageNum++
          })
        })
      }
    })
  }

  if (processing || loading) {
    return <Loader />
  }
  else {
    return (
      <Layout>
        <Seo title="My Books" />
        <AuthLayout page="Books">
          <BooksContainer
            duplicateBook={duplicateBook}
            getLocalStorage={getLocalStorage}
            handleBookDelete={handleBookDelete}
            processing={processing}
            renameBook={renameBook}
            userBooks={userBooks}
            setShowModal={setShowModal}
            sortBooks={sortBooks}
          />
          {showModal.show && (
            <>
              {showModal.type === "createbook" && (
                <NewBookModal
                  bookData={bookData}
                  setBookData={setBookData}
                  setShowModal={setShowModal}
                  toast={toast}
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
        </AuthLayout>
        <ToastContainer
          autoClose={3000}
          closeOnClick
          draggable
          draggablePercent={50}
          hideProgressBar={false}
          limit={3}
          newestOnTop={false}
          pauseOnFocusLoss
          pauseOnHover
          position="bottom-center"
          rtl={false}
          theme="colored"
          style={{
            fontFamily: fonts.secondary,
            fontSize: "0.75rem",
          }}
        />
      </Layout>
    )
  }
}

export default UserBooks
