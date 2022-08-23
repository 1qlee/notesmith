import React from 'react'
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledContextMenu = styled.article`
  background-color: ${colors.white};
  box-shadow: ${colors.shadow.layeredSmall};
  border-radius: 0.25rem;
  font-size: 0.8rem;
  padding: 0.5rem 0;
  position: absolute;
`

const ContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  font-family: "Inter", Helvetica, Tahoma, sans-serif;
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
  background-color: ${colors.gray.threeHundred};
  height: 1px;
  border: none;
  margin: 0.5rem 0;
`

const ContextMenu = (
  {
    selectedBookId,
    selectedBook,
    duplicateBook,
    handleBookDelete,
    coordinates,
    showContextMenu,
    setShowBookTitleInput
  }
) => {

  return showContextMenu && (
    <StyledContextMenu style={{
      top: coordinates.y,
      left: coordinates.x
    }}>
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
        onClick={() => duplicateBook(selectedBook)}
        tabindex="0"
      >
        <ContextMenuItem>
          Duplicate
        </ContextMenuItem>
      </ContextMenuLink>
      <ContextMenuLink
        onClick={() => setShowBookTitleInput(true)}
        tabindex="0"
      >
        <ContextMenuItem>
          Rename
        </ContextMenuItem>
      </ContextMenuLink>
      <ContextMenuDivider />
      <ContextMenuLink
        onClick={() => handleBookDelete(selectedBook)}
        tabindex="0"
      >
        <ContextMenuItem>
          Delete
        </ContextMenuItem>
      </ContextMenuLink>
    </StyledContextMenu>
  )
}

export default ContextMenu
