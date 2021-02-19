import React from 'react'
import { Link } from "gatsby"
import styled from "styled-components"
import { colors } from "../../styles/variables"

const StyledContextMenu = styled.article`
  background-color: ${colors.gray.nineHundred};
  box-shadow: ${colors.shadow.modal};
  color: ${colors.white};
  font-size: 0.8rem;
  position: absolute;
  padding: 0.5rem 0;
`

const ContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 2rem;
  position: relative;
  &:hover {
    cursor: pointer;
    background-color: ${colors.blue.sixHundred};
  }
  a {
    width: 100%;
  }
`

const ContextMenuDivider = styled.hr`
  background-color: ${colors.gray.sevenHundred};
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
      <ContextMenuItem>
        <Link to={`/app/create/${selectedBookId}`}>
          Open
        </Link>
      </ContextMenuItem>
      <ContextMenuItem>
        <a
          href={`/app/create/${selectedBookId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in new tab
        </a>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem
        onClick={() => duplicateBook(selectedBook)}
      >
        Duplicate
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => setShowBookTitleInput(true)}
      >
        Rename
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem
        onClick={() => handleBookDelete(selectedBook)}
      >
        Delete
      </ContextMenuItem>
    </StyledContextMenu>
  )
}

export default ContextMenu
