import React, { useEffect } from 'react'
import { colors } from '../../styles/variables';
import { calculateDiscounts, formatDollars } from "../../utils/helper-functions"
import { CaretDown } from "@phosphor-icons/react"

import { StyledFieldset, StyledLabel, SelectWrapper, StyledSelect, SelectIcon, SelectLabel, QuantityTracker } from '../form/FormComponents'
import { Flexbox } from '../layout/Flexbox'
import Content from '../ui/Content'
import StrikeText from '../misc/StrikeText'

// Add any other necessary imports here

const VolumeQuantitySelect = ({
  volumeQuantity,
  setVolumeQuantity,
  itemQuantity,
  setItemQuantity,
  setSubtotal,
  bookData,
  stacked,
}) => {
  let originalPrice = formatDollars(bookData.price / 100)
  let discounts = calculateDiscounts({
    price: bookData.price,
    quantity: itemQuantity,
    rate: bookData.discount,
  })
  let { percent, formattedSubtotal, formattedPrice } = discounts

  useEffect(() => {
    setSubtotal(formattedSubtotal)

    if (itemQuantity < 5) {
      setVolumeQuantity(0)
    }
    else if (itemQuantity >= 5 && itemQuantity < 10) {
      setVolumeQuantity(5)
    }
    else if (itemQuantity >= 10 && itemQuantity < 20) {
      setVolumeQuantity(10)
    }
    else if (itemQuantity >= 20) {
      setVolumeQuantity(20)
    }
  }, [itemQuantity])

  return (
    <Flexbox
      width="100%"
      flexdirection={stacked ? "column" : "row"}
    >
      <StyledFieldset
        flex="0"
      >
        <StyledLabel
          htmlFor="quantity-tracker"
        >
          Quantity
        </StyledLabel>
        <QuantityTracker
          id="quantity-tracker"
          buttonwidth="1rem"
          buttonheight="1rem"
          buttonleft="calc(50% - 40px)"
          buttonright="calc(50% - 40px)"
          counterwidth="100px"
          counterpadding="14px"
          counterfontsize="1rem"
          iconsize="0.75rem"
          setItemQuantity={setItemQuantity}
          itemQuantity={itemQuantity}
        />
      </StyledFieldset>
      <StyledFieldset
        margin={stacked ? "0" : "0 0 0 16px"}
        flex="1"
      >
        <StyledLabel htmlFor="discount-select">Volume discounts</StyledLabel>
        <SelectWrapper>
          <StyledSelect
            fontsize="1rem"
            width="100%"
            onChange={(e) => {
              setItemQuantity(+e.target.value || 1)
              setVolumeQuantity(+e.target.value)
            }}
            value={volumeQuantity}
            id="discount-select"
          >
            <option value={0} default>&lt; 5 - {calculateDiscounts({ price: bookData.price, quantity: 0, rate: bookData.discount }).formattedPrice} each</option>
            <option value={5}>5 - {calculateDiscounts({ price: bookData.price, quantity: 5, rate: bookData.discount }).formattedPrice} each</option>
            <option value={10}>10 - {calculateDiscounts({ price: bookData.price, quantity: 10, rate: bookData.discount }).formattedPrice} each</option>
            <option value={20}>20 - {calculateDiscounts({ price: bookData.price, quantity: 20, rate: bookData.discount }).formattedPrice} each</option>
          </StyledSelect>
          <SelectIcon
            top="20px"
            right="8px"
          >
            <CaretDown size="1rem" />
          </SelectIcon>
          <SelectLabel
            htmlFor="discount-select"
          >
            <Flexbox
              justify="space-between"
              align="center"
            >
              <Content
                hiddenminwidth="991"
                hiddenmaxwidth="1070"
              >
                {itemQuantity >= 5 && (
                  <StrikeText
                    hiddenminwidth="991"
                    hiddenmaxwidth="1240">
                    {originalPrice}
                  </StrikeText>
                )}
                <span>{formattedPrice} each</span>
              </Content>
              {itemQuantity >= 5 && (
                <Content
                  paragraphlineheight="normal"
                  paragraphmargin="0"
                  paragraphfontweight="700"
                  paragraphcolor={colors.green.sixHundred}
                >
                  <p>{percent}% off</p>
                </Content>
              )}
            </Flexbox>
          </SelectLabel>
        </SelectWrapper>
      </StyledFieldset>
    </Flexbox>
  )
}

export default VolumeQuantitySelect