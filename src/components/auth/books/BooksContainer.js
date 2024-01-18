import React, { useEffect, useState, useCallback, useRef } from "react"
import { colors } from "../../../styles/variables"
import { navigate, Link } from "gatsby"

import { Flexbox } from "../../layout/Flexbox"
import { StyledInput } from "../../form/FormComponents"
import { Select } from "../../ui/Select"
import Table from "../../ui/Table"
import Button from "../../ui/Button"
import ContextMenu from "../../ui/ContextMenu"
import Content from "../../ui/Content"
import Box from "../../ui/Box"

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
  const contextMenuRef = useRef(null)
  const booksTableRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const { target } = event

      // any clicks that occur outside of the table
      if (booksTableRef.current && !booksTableRef.current.contains(target)) {
        setShowContextMenu(false)
        setShowBookTitleInput(false)

        if (selectedBookDOM) {
          selectedBookDOM.classList.remove("is-selected")
          setSelectedBookDOM(null)
        }
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowContextMenu(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleEscapeKey)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [userBooks, contextMenuRef, showContextMenu])

  function handleRenameBook(e) {
    e.preventDefault()
    console.log(newBookTitle, selectedBookTitle)

    if (newBookTitle) {
      // db function from props
      renameBook(newBookTitle, selectedBookId)
      setShowBookTitleInput(false)
    }
    else if (newBookTitle === selectedBookTitle) {
      setShowBookTitleInput(false)
    }
    else if (!newBookTitle) {
      setShowBookTitleInput(false)
    }
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

  function handleBookDoubleClick(e, book) {
    if (e.target.nodeName !== "INPUT") {
      navigate(`/customize/${book.slug}/${book.id}`)
    }
  }

  function handleShowContextMenu(e, book) {
    const { clientX, clientY } = e
    
    e.preventDefault()
    // to display the menu on cursor
    setCoordinates({
      x: clientX,
      y: clientY,
    })
    // show in DOM
    setShowContextMenu(true)
    // save book title to state
    setSelectedBookTitle(book.title)
  }

  const renameBookTitleRef = useCallback(node => {
    if (node !== null) {
      node.select()
    }
  }, [])

  return (
    <>
      <Content
        margin="32px 0 16px"
      >
        Right click on any row in the table below to see more options.
      </Content>
      <Flexbox
        flex="flex"
        align="center"
        margin="16px 0"
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
      <Box 
        position="relative"
        ref={booksTableRef}
      >
        <Table>
          <thead>
            <th>Title</th>
            <th>Date created</th>
            <th></th>
          </thead>
          <tbody style={{ position: 'relative' }}>
            {userBooks && userBooks.map(book => (
              <tr
                data-title={book.title}
                key={book.id}
                onClick={e => handleBookSelect(e, book)}
                onDoubleClick={e => handleBookDoubleClick(e, book)}
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
                        autocomplete="chrome-off"
                        defaultValue={selectedBookTitle}
                        fontsize="1rem"
                        id="new-book-title"
                        name="new-book-title"
                        onChange={e => setNewBookTitle(e.target.value.trim())}
                        onKeyDown={e => e.key === "Escape" && setShowBookTitleInput(false)}
                        padding="4px"
                        ref={renameBookTitleRef}
                        type="text"
                      />
                    </form>
                  ) : (
                    <p>
                      {book.title}
                    </p>
                  )}
                </td>
                <td>{convertTime(book.dateCreated)}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/customize/${book.slug}/${book.id}`}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ContextMenu
          ref={contextMenuRef}
          id="user-book-table-menu"
          selectedBook={selectedBook}
          selectedBookId={selectedBookId}
          duplicateBook={duplicateBook}
          handleBookDelete={handleBookDelete}
          coordinates={coordinates}
          showContextMenu={showContextMenu}
          setShowContextMenu={setShowContextMenu}
          setShowBookTitleInput={setShowBookTitleInput}
        />
      </Box>
    </>
  )
}

export default BooksContainer
