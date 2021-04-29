import React, { useEffect, useState, useCallback } from "react"
import { navigate } from "gatsby"
import { colors, spacing } from "../../../styles/variables"
import { Grid, Cell } from "styled-css-grid"

import { Book, BookInput } from "./BookComponents"
import ContextMenu from "../../ui/ContextMenu"
import Content from "../../Content"

// should export this function to utils
function convertTime(time) {
  const dateObject = new Date(time)
  const humanDateFormat = Intl.DateTimeFormat().format(dateObject)

  return humanDateFormat
}

function BooksContainer({ userBooks, renameBook, handleBookDelete, duplicateBook }) {
  const [selectedBook, setSelectedBook] = useState()
  const [selectedBookDOM, setSelectedBookDOM] = useState(null)
  const [selectedBookTitle, setSelectedBookTitle] = useState()
  const [selectedBookId, setSelectedBookId] = useState()
  const [showBookTitleInput, setShowBookTitleInput] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState()
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    document.addEventListener('click', closeContextMenu)

    return function cleanup() {
      document.removeEventListener('click', closeContextMenu)
    }

  }, [userBooks])

  function closeContextMenu() {
    setShowContextMenu(false)
  }

  function handleRenameBook(e) {
    e.preventDefault()
    // db function from props
    renameBook(selectedBookTitle, newBookTitle, selectedBookId)
    setShowBookTitleInput(false)
  }

  function handleBookSelect(e, book) {
    const bookDOM = e.currentTarget
    // book is the node from where the select occurred
    // if there's already a selected book, remove it
    if (selectedBookDOM) {
      selectedBookDOM.classList.remove("is-selected")
      setSelectedBookDOM(null)
    }
    // hide book title input
    if (e.target.nodeName !== "INPUT") {
      setShowBookTitleInput(false)
    }
    // add class to indicate selected state
    bookDOM.classList.add("is-selected")
    // save selected book and its title in state
    setSelectedBook(book)
    setSelectedBookDOM(bookDOM)
    setSelectedBookTitle(book.title)
    setSelectedBookId(book.id)
  }

  function handleShowContextMenu(e, book) {
    e.preventDefault()
    // to display the menu on cursor
    setCoordinates({
      x: e.clientX,
      y: e.clientY
    })
    // show in DOM
    setShowContextMenu(true)
    // save book title to state
    setSelectedBookTitle(book.title)
  }

  function handleClickOutside(e) {
    // anything with data-clickoutside
    if (e.target.dataset.clickoutside) {
      // if a book is currently selected, remove it
      if (selectedBookDOM) {
        selectedBookDOM.classList.remove("is-selected")
        setShowBookTitleInput(false)
        setSelectedBookDOM(null)
        setSelectedBookTitle(null)
      }
    }
  }

  const renameBookTitleRef = useCallback(node => {
    if (node !== null) {
      node.select()
    }
  }, [])

  return (
    <>
      <Grid
        columnGap={spacing.normal}
        columns="repeat(auto-fit, minmax(250px, 1fr))"
        data-clickoutside={true}
        height="100%"
        onClick={e => handleClickOutside(e)}
        rowGap={spacing.normal}
        style={{gridAutoRows: "min-content"}}
      >
        {userBooks.map(book => (
          <Cell
            key={book.id}
          >
            <Book
              data-title={book.title}
              onClick={e => handleBookSelect(e, book)}
              onDoubleClick={() => navigate(`/app/create/${book.id}`)}
              onContextMenu={e => {
                handleBookSelect(e, book)
                handleShowContextMenu(e, book)
              }}
            >
              {selectedBookId === book.id && showBookTitleInput ? (
                <form onSubmit={e => handleRenameBook(e)}>
                  <BookInput
                    type="text"
                    id="new-book-title"
                    name="new-book-title"
                    autocomplete="chrome-off"
                    defaultValue={selectedBookTitle}
                    onChange={e => setNewBookTitle(e.target.value)}
                    ref={renameBookTitleRef}
                  />
                </form>
              ) : (
                <p>
                  {book.title}
                </p>
              )}
              <small>Created on {convertTime(book.date_created)}</small>
            </Book>
          </Cell>
        ))}
      </Grid>
      <ContextMenu
        selectedBook={selectedBook}
        selectedBookId={selectedBookId}
        duplicateBook={duplicateBook}
        handleBookDelete={handleBookDelete}
        coordinates={coordinates}
        showContextMenu={showContextMenu}
        setShowBookTitleInput={setShowBookTitleInput}
      />
    </>
  )
}

export default BooksContainer
