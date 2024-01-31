import React, { forwardRef } from 'react'
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledContextMenu = styled.article`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layeredSmall};
  font-size: 0.875rem;
  padding: 0.5rem 0;
  position: fixed;
  border: ${colors.borders.black};
`

const ContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  display: block;
  padding: 0.25rem 2rem;
  width: 100%;
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray.twoHundred};
  }
`

const ContextMenuLink = styled.a`
  display: block;
  width: 100%;
  &:focus {
    outline: none;
  }
`

const ContextMenuDivider = styled.hr`
  height: 0;
  border-top: 1px dashed ${colors.gray.threeHundred};
  margin: 0.5rem 0;
`

const ContextMenu = forwardRef((
  {
    id,
    selectedBookId,
    selectedBook,
    duplicateBook,
    handleBookDelete,
    coordinates,
    showContextMenu,
    setShowContextMenu,
    setShowBookTitleInput
  },
  ref
) => {

  function handleContextItem(cb) {
    setShowContextMenu(false)
    return cb
  }

  return showContextMenu && (
    <StyledContextMenu 
      ref={ref}
      id={id}
      style={{
        top: coordinates.y,
        left: coordinates.x
      }}
    >
      <ContextMenuLink
        href={`/customize/${selectedBook.slug}/${selectedBookId}`}
      >
        <ContextMenuItem>
          Open
        </ContextMenuItem>
      </ContextMenuLink>
      <ContextMenuLink
        href={`/customize/${selectedBook.slug}/${selectedBookId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ContextMenuItem>
          Open in new tab
        </ContextMenuItem>
      </ContextMenuLink>
      <ContextMenuDivider />
      <ContextMenuLink
        onClick={() => handleContextItem(duplicateBook(selectedBook))}
        tabindex="0"
      >
        <ContextMenuItem>
          Duplicate
        </ContextMenuItem>
      </ContextMenuLink>
      <ContextMenuLink
        onClick={() => handleContextItem(setShowBookTitleInput(true))}
        tabindex="0"
      >
        <ContextMenuItem>
          Rename
        </ContextMenuItem>
      </ContextMenuLink>
      <ContextMenuDivider />
      <ContextMenuLink
        onClick={() => handleContextItem(handleBookDelete(selectedBook))}
        tabindex="0"
      >
        <ContextMenuItem>
          Delete
        </ContextMenuItem>
      </ContextMenuLink>
    </StyledContextMenu>
  )
})

export default ContextMenu
