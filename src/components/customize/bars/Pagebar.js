import React, { memo, useRef } from "react"
import { colors } from "../../../styles/variables"
import { FixedSizeGrid as WindowGrid, areEqual } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import memoizeOne from "memoize-one"
import styled from "styled-components"
import SVG from "react-inlinesvg"
import { useEditorDispatch } from "../context/editorContext"
import { useSettingsContext } from "../context/settingsContext"

import PageBox from "../boxes/PageBox"

const PagebarWrapper = styled.div`
  background-color: ${colors.white};
  border-right: ${colors.borders.black};
  height: 100%;
  width: 164px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 8;
`

const StyledPage = styled.div`
  text-align: center;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 0 16px;
  p {
    color: ${colors.gray.sixHundred};
    font-size: 0.875rem;
    margin: 8px 0 0 0;
    transition: color 0.2s;
    user-select: none;
  }
  svg {
    border: 1px solid ${colors.gray.threeHundred};
    border-radius: 4px;
    height: 64px;
    pointer-events: none;
    transition: transform 0.2s, border-color 0.2s;
    width: 48px;
  }
  &.is-active {
    p {
      color: ${colors.gray.nineHundred};
    }
    svg {
      border-color: ${colors.gray.nineHundred};
      transform: translate(1px, 1px);
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      svg {
        border-color: ${colors.gray.sixHundred};
      }
    }
  }
`

const PageWindow = styled.div`
  height: calc(100% - 32px);
`

const Page = memo(props => {
  const {
    columnIndex,
    data,
    rowIndex,
    style,
  } = props
  const {
    canvasPages,
    canvasPageTemplates,
    pageData,
    selectedPage,
    setSelectedPage,
    setPageData,
    setActiveTab,
  } = data
  const dispatch = useEditorDispatch()
  const columnCount = 2
  // current page based on index of canvasPages calculated from WindowsGrid row and column values
  const currentPage = canvasPages[parseInt(rowIndex * columnCount + columnIndex)]

  // change the selected page number
  function handleSelectPage(value) {
    const pageNumber = parseInt(value)
    setPageData({
      ...pageData,
      template: "",
    })
    setActiveTab(0)
    setSelectedPage(pageNumber)
    dispatch({
      type: "change-mode",
      mode: "select",
    })
  }

  return (
    <StyledPage
      onClick={e => handleSelectPage(currentPage.pageNumber)}
      className={selectedPage === currentPage.pageNumber ? "is-active" : null}
      style={style}
    >
      <SVG
        xmlns="http://www.w3.org/2000/svg"
        src={canvasPageTemplates[currentPage.pageId].svg}
      />
      <p>{currentPage.pageNumber}</p>
    </StyledPage>
  )
}, areEqual)

const createItemData = memoizeOne((canvasPages, canvasPageTemplates, pageData, selectedPage, setSelectedPage, setPageData, setActiveTab) => ({
  canvasPages,
  canvasPageTemplates,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPage,
  setActiveTab,
}))

function Pagebar({
  productData,
  canvasPages,
  canvasPageTemplates,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPage,
  setActiveTab,
}) {
  const settingsState = useSettingsContext()
  const itemData = createItemData(canvasPages, canvasPageTemplates, pageData, selectedPage, setSelectedPage, setPageData, setActiveTab)
  const pagebarRef = useRef(null)

  function handleScrollToItem(values) {
    pagebarRef.current.scrollToItem(values);
  }

  if (!settingsState.view_pages) {
    return
  }

  return (
    <PagebarWrapper>
      <PageBox
        productData={productData}
        handleScrollToItem={handleScrollToItem}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <PageWindow>
        <AutoSizer>
          {({ height }) => (
            <WindowGrid
              ref={pagebarRef}
              className="window-grid"
              useIsScrolling
              columnCount={2}
              columnWidth={64}
              height={height}
              rowCount={70}
              rowHeight={112}
              width={164}
              overscanColumnCount={0}
              overscanRowCount={0}
              style={{
                backgroundColor: 'white',
                borderRight: `${colors.borders.black}`,
                top: "0",
                overflowX: "hidden",
                paddingBottom: "16px"
              }}
              itemData={itemData}
            >
              {Page}
            </WindowGrid>
          )}
        </AutoSizer>
      </PageWindow>
    </PagebarWrapper>
  )
}

export default Pagebar
