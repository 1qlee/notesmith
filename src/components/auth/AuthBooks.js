import React, { useEffect, useState } from "react"
import { fonts, widths, colors } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { ref, query, orderByChild, equalTo, update, remove, onValue, get, set, push } from "firebase/database"
import { ToastContainer, toast } from 'react-toastify'

import { Flexbox } from "../layout/Flexbox"
import Button from "../ui/Button"
import Content from "../ui/Content"
import AuthLayout from "./components/AuthLayout"
import BooksContainer from "./books/BooksContainer"
import DeleteBookModal from "./modals/DeleteBookModal"
import Layout from "../layout/Layout"
import Loader from "../misc/Loader"
import NewBookModal from "./modals/AppNewBookModal"

const UserBooks = ({ allProducts }) => {
  const isBrowser = typeof window !== "undefined"
  const { loading, user, firebaseDb } = useFirebaseContext()
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
      onValue(query(ref(firebaseDb, "books"), orderByChild('uid'), equalTo(user.uid)), (snapshot) => {
        const booksArray = []
        // push them into an array const
        snapshot.forEach(book => {
          booksArray.push(book.val())
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

    update(ref(firebaseDb), updates).catch(error => {
      if (error) {
        toast.error("Failed to update book title.")
      }
      else {
        toast.success("Book title updated.")
      }
    })
  }

  function deleteBook(book) {
    // remove the book from the books collection
    remove(ref(firebaseDb, `books/${book.id}`)).then(() => {
      // remove the book from user's 'books'
      remove(ref(firebaseDb, `users/${user.uid}/books/${book.id}`))
      // delete all pages that belong to this bookId
      get(query(ref(firebaseDb, "pages"), orderByChild('bookId'), equalTo(book.id))).then((snapshot) => {
        snapshot.forEach(child => {
          remove(ref(firebaseDb, `pages/${child.key}`))
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

  function duplicateBook(book) {
    // create a new key
    const newBookKey = push(ref(firebaseDb, "books")).key
    // keep track of each page within this object
    const pagesObject = {}

    // get all pages for this bookId
    get(query(ref(firebaseDb, "pages"), orderByChild('bookId'), equalTo(book.id))).then((snapshot) => {
      snapshot.forEach(child => {
        const page = child.val()
        // create a new page key (id)
        const newPageKey = push(ref(firebaseDb, "pages")).key
        // creating key:value pairs for old page id to new page id
        pagesObject[page.id] = newPageKey

        // write the new page into the db
        set(ref(firebaseDb, `pages/${newPageKey}`), {
          "bookId": newBookKey,
          "svg": page.svg,
          "id": newPageKey,
          "uid": user.uid,
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
      set(ref(firebaseDb, `books/${newBookKey}`), {
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
        "uid": user.uid,
        "widthInch": book.widthInch,
        "widthPixel": book.widthPixel,
      }).then(() => {
        // afterwards, log that book id into 'users/userId/books/bookId'
        set(ref(firebaseDb, `users/${user.uid}/books/${newBookKey}`), true)
      })
    }).catch(error => {
      toast.error("Failed to duplicate book.")
    })
  }

  if (processing || loading) {
    return <Loader />
  }
  else {
    return (
      <Layout>
        <AuthLayout page="Books">
          {userBooks.length > 0 ? (
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
          ) : (
            <Flexbox
              alignitems="center"
              justifycontent="center"
              width="100%"
              height="500px"
            >
              <Content
                textalign="center"
                h1fontsize="3rem"
                maxwidth={widths.content.index}
              >
                <h1>Create your own notebook now</h1>
                <p>It's easy to get started with creating your own notebook. Simply press the button below to begin!</p>
                <Button
                  color={colors.gray.oneHundred}
                  backgroundcolor={colors.gray.nineHundred}
                  margin="16px 0 0 0"
                  padding="16px 24px"
                  fontsize="1rem"
                  onClick={() => setShowModal({
                    show: true,
                    type: "createbook",
                  })}
                >
                  New book
                </Button>
              </Content>
            </Flexbox>
          )}
          {showModal.show && (
            <>
              {showModal.type === "createbook" && (
                <NewBookModal
                  bookData={bookData}
                  allProducts={allProducts}
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
