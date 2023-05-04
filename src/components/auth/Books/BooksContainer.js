import React, { useEffect, useState, useCallback } from "react"
import { colors } from "../../../styles/variables"
import { navigate } from "gatsby"

import { Flexbox } from "../../layout/Flexbox"
import { SectionAppWorkspace } from "../../layout/Section"
import { StyledInput } from "../../form/FormComponents"
import { Select } from "../../ui/Select"
import Table from "../../ui/Table"
import Button from "../../ui/Button"
import Content from "../../ui/Content"
import ContextMenu from "../../ui/ContextMenu"

// should export this function to utils
function convertTime(time) {
  const dateObject = new Date(time)
  const humanDateFormat = Intl.DateTimeFormat().format(dateObject)

  return humanDateFormat
}

function BooksContainer({
  duplicateBook,
  getLocalStorage,
  handleBookDelete,
  renameBook,
  userBooks,
  setShowModal,
  sortBooks,
}) {
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
    renameBook(newBookTitle, selectedBookId)
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
    <div
      data-clickoutside={true}
      onClick={e => handleClickOutside(e)}
    >
      <Flexbox
        flex="flex"
        alignitems="center"
        margin="0 0 16px"
      >
        <Button
          color={colors.gray.oneHundred}
          backgroundcolor={colors.gray.nineHundred}
          margin="0 16px 0 0"
          onClick={() => setShowModal({
            show: true,
            type: "createbook",
          })}
        >
          New book
        </Button>
        <Select
          initialDbValue={getLocalStorage("sortMethod")}
          initialOption={getLocalStorage("sortValue")}
          initialSortOrder={getLocalStorage("sortOrder")}
          mainFunction={sortBooks}
        />
      </Flexbox>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date created</th>
          </tr>
        </thead>
        <tbody>
          {userBooks && userBooks.map(book => (
            <tr
              data-title={book.title}
              key={book.id}
              onClick={e => handleBookSelect(e, book)}
              onDoubleClick={() => navigate(`/customize/${book.slug}/${book.id}`)}
              tabIndex="0"
              onContextMenu={e => {
                handleBookSelect(e, book)
                handleShowContextMenu(e, book)
              }}
            >
              <td>
                {selectedBookId === book.id && showBookTitleInput ? (
                  <form onSubmit={e => handleRenameBook(e)}>
                    <StyledInput
                      type="text"
                      id="new-book-title"
                      name="new-book-title"
                      autocomplete="chrome-off"
                      defaultValue={selectedBookTitle}
                      onChange={e => setNewBookTitle(e.target.value.trim())}
                      padding="4px"
                      ref={renameBookTitleRef}
                    />
                  </form>
                ) : (
                  <p>
                    {book.title}
                  </p>
                )}
              </td>
              <td>{convertTime(book.dateCreated)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ContextMenu
        selectedBook={selectedBook}
        selectedBookId={selectedBookId}
        duplicateBook={duplicateBook}
        handleBookDelete={handleBookDelete}
        coordinates={coordinates}
        showContextMenu={showContextMenu}
        setShowBookTitleInput={setShowBookTitleInput}
      />
    </div>
  )
}

export default BooksContainer
