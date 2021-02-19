import React from "react"
import { colors } from "../../styles/variables"

import { QuantityTracker, StyledFieldset, StyledSelect, StyledLabel } from "../form/FormComponents"
import Button from "../Button"
import Content from "../Content"
import { ProductDetails } from "./ShopComponents"

const ProductInfo = ({
  bookData,
  setBookData,
  setEditMode
}) => {

  function createBookDimensions(size) {
    switch(size) {
      case "Medium":
        setBookData({...bookData, width: 528, height: 816})
        break
      default:
        setBookData({...bookData, width: 528, height: 816})
    }
  }

  return (
    <ProductDetails>
      <Content
        h3FontWeight="400"
        paragraphFontSize="1.25rem"
        ulFontSize="1.25rem"
        margin="0 0 2rem"
      >
        <h2>Notebook (Pack of 3)</h2>
        <p>$30</p>
        <p>Three signature Notesmith notebooks, conveniently packed together. Customize each page using our editor!</p>
      </Content>
      <form>
        <StyledFieldset
          margin="0 0 1rem"
          className="is-horizontal"
        >
          <div>
            <StyledLabel>Size</StyledLabel>
            <StyledSelect
              borderRadius="0.25rem"
              width="100%"
              fontSize="1.1rem"
              value={bookData.size}
              onChange={e => createBookDimensions(e.target.value)}
            >
              <option value="Medium">A5 (5.5" x 8.5")</option>
            </StyledSelect>
          </div>
          <div>
            <StyledLabel>Color</StyledLabel>
            <StyledSelect
              borderRadius="0.25rem"
              width="100%"
              fontSize="1.1rem"
              value={bookData.color}
              onChange={e => setBookData({...bookData, color: e.target.value})}
            >
              <option value="Cadet Gray">Cadet Gray</option>
            </StyledSelect>
          </div>
        </StyledFieldset>
        <StyledFieldset
          margin="0 0 1rem"
          className="is-vertical"
        >
          <StyledLabel>Quantity</StyledLabel>
          <QuantityTracker />
        </StyledFieldset>
        <StyledFieldset
          margin="0 0 1rem"
          className="has-buttons"
        >
          <Button
            backgroundColor={colors.black}
            color={colors.white}
            padding="1rem"
            width="100%"
            onClick={e => {
              e.preventDefault()
              setEditMode(true)
            }}
          >
            Customize pages
          </Button>
          <Button
            backgroundColor={colors.primary.sixHundred}
            color={colors.white}
            padding="1rem"
            width="100%"
          >
            Add to cart
          </Button>
        </StyledFieldset>
      </form>
    </ProductDetails>
  )
}

export default ProductInfo
