import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { colors, convertToDecimal, fonts } from "../../styles/variables"
import { useShoppingCart } from "use-shopping-cart"
import { CaretDown, CaretUp } from "phosphor-react"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import CartQuantityTracker from "./CartQuantityTracker"
import { Flexbox } from "../layout/Flexbox"
import { StyledTable } from "../form/FormComponents"
import TextLink from "../ui/TextLink"
import Button from "../ui/Button"
import Content from "../ui/Content"
import Icon from "../ui/Icon"

function ShoppingCart() {
  const {
    cartDetails,
    setItemQuantity,
    removeItem,
    totalPrice,
  } = useShoppingCart()
  const [activeItemIds, setActiveItemIds] = useState({})
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    // array to store cartItems
    const cartItemsArray = []
    // push all product objects in cartDetails to an array
    for (const cartItem in cartDetails) {
      cartItemsArray.push(cartDetails[cartItem])
    }

    setCartItems(cartItemsArray)
  }, [cartDetails])

  function handleViewDetails(itemId) {
    const dummy = activeItemIds

    if (activeItemIds[itemId]) {
      delete dummy[itemId]
      setActiveItemIds({
        ...dummy
      })
    }
    else {
      setActiveItemIds({
       ...activeItemIds,
       [itemId]: itemId,
     })
   }
  }

  return (
    <div>
      <Content
        margin="0 0 2rem 0"
        h1fontweight="400"
        h1fontsize="3rem"
      >
        <h1>Cart</h1>
      </Content>
      {cartItems.length > 0 ? (
        <>
          <StyledTable>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th style={{textAlign:"right"}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Flexbox
                      flex="flex"
                      alignitems="center"
                      height="100%"
                    >
                      <Link
                        to={`/products/${item.category}/${item.slug}/${item.coverColor}`}
                      >
                        <GatsbyImage
                          image={getImage(item.image)}
                          alt="product thumbnail"
                        />
                      </Link>
                      <Flexbox margin="0 0 0 1rem">
                        <Content
                          paragraphmargin="0"
                          paragraphfontsize="1.2rem"
                          smallfontsize="0.875rem"
                          smallmargin="0"
                        >
                          <Link
                            to={`/products/${item.category}/${item.slug}/${item.coverColor}`}
                          >
                            <p><b>{item.name}</b></p>
                          </Link>
                        </Content>
                        <Flexbox
                          flex="flex"
                          alignitems="center"
                          justifycontent="space-between"
                        >
                          {item.category === "notebooks" && (
                            <TextLink
                              fontsize="0.625rem"
                              flex="inline-flex"
                              alignitems="center"
                              margin="0 0.5rem 0 0"
                              onClick={() => handleViewDetails(item.id)}
                              color={colors.gray.nineHundred}
                            >
                              View details
                              <Icon margin="0 0 0 0.125rem">
                                {activeItemIds[item.id] ? (
                                  <CaretUp size="0.625rem" />
                                ) : (
                                  <CaretDown size="0.625rem" />
                                )}
                              </Icon>
                            </TextLink>
                          )}
                          <TextLink
                            fontsize="0.625rem"
                            onClick={() => removeItem(item.id)}
                            color={colors.gray.nineHundred}
                          >
                            Remove
                          </TextLink>
                        </Flexbox>
                        {activeItemIds[item.id] && (
                          <Flexbox
                            margin="1rem 0 0"
                          >
                            {item.custom ? (
                              <>
                                <Flexbox
                                  flex="flex"
                                  alignitems="center"
                                  justifycontent="space-between"
                                  margin="0 0 0.25rem 0"
                                >
                                  <Content
                                    headingfontfamily={fonts.secondary}
                                    h3fontsize="0.75rem"
                                    h3margin="0"
                                    margin="0"
                                  >
                                    <h3>Cover</h3>
                                  </Content>
                                  <Content
                                    paragraphfontsize="0.875rem"
                                    paragraphmarginbottom="0"
                                    paragraphtexttransform="capitalize"
                                  >
                                    <p>{item.coverColor}</p>
                                  </Content>
                                </Flexbox>
                                <Flexbox
                                  flex="flex"
                                  alignitems="center"
                                  justifycontent="space-between"
                                  margin="0 0 0.25rem 0"
                                >
                                  <Content
                                    headingfontfamily={fonts.secondary}
                                    h3fontsize="0.75rem"
                                    h3margin="0"
                                    margin="0"
                                  >
                                    <h3>Pages</h3>
                                  </Content>
                                  <Content
                                    paragraphfontsize="0.875rem"
                                    paragraphmarginbottom="0"
                                    paragraphtexttransform="capitalize"
                                  >
                                    <Link to={`/customize/${item.slug}/${item.bookId}`}>
                                      <p>View</p>
                                    </Link>
                                  </Content>
                                </Flexbox>
                              </>
                            ) : (
                              <>
                                {item.category === "notebooks" && (
                                  <>
                                    <Flexbox
                                      flex="flex"
                                      alignitems="center"
                                      justifycontent="space-between"
                                      margin="0 0 0.25rem 0"
                                    >
                                      <Content
                                        headingfontfamily={fonts.secondary}
                                        h3fontsize="0.75rem"
                                        h3margin="0"
                                        margin="0"
                                      >
                                        <h3>Cover</h3>
                                      </Content>
                                      <Content
                                        paragraphfontsize="0.875rem"
                                        paragraphmarginbottom="0"
                                        paragraphtexttransform="capitalize"
                                      >
                                        <p>{item.coverColor}</p>
                                      </Content>
                                    </Flexbox>
                                    <Flexbox
                                      flex="flex"
                                      alignitems="center"
                                      justifycontent="space-between"
                                      margin="0 0 0.25rem 0"
                                    >
                                      <Content
                                        headingfontfamily={fonts.secondary}
                                        h3fontsize="0.75rem"
                                        h3margin="0"
                                        margin="0"
                                      >
                                        <h3>Left pages</h3>
                                      </Content>
                                      <Content
                                        paragraphfontsize="0.875rem"
                                        paragraphmarginbottom="0"
                                        paragraphtexttransform="capitalize"
                                      >
                                        <p>{item.leftPageData.template}</p>
                                      </Content>
                                    </Flexbox>
                                    <Flexbox
                                      flex="flex"
                                      alignitems="center"
                                      justifycontent="space-between"
                                      margin="0 0 0.25rem 0"
                                    >
                                      <Content
                                        headingfontfamily={fonts.secondary}
                                        h3fontsize="0.75rem"
                                        h3margin="0"
                                        margin="0"
                                      >
                                        <h3>Right pages</h3>
                                      </Content>
                                      <Content
                                        paragraphfontsize="0.875rem"
                                        paragraphmarginbottom="0"
                                        paragraphtexttransform="capitalize"
                                      >
                                        <p>{item.rightPageData.template}</p>
                                      </Content>
                                    </Flexbox>
                                  </>
                                )}
                              </>
                            )}
                          </Flexbox>
                        )}
                      </Flexbox>
                    </Flexbox>
                  </td>
                  <td>
                    <Flexbox
                      flex="flex"
                      alignitems="center"
                      height="100%"
                    >
                      <Content
                        paragraphmargin="0"
                        paragraphfontsize="1.25rem"
                      >
                        <p>
                          ${convertToDecimal(item.price, 2)}
                        </p>
                      </Content>
                    </Flexbox>
                  </td>
                  <td>
                    <CartQuantityTracker
                      buttonwidth="1rem"
                      buttonheight="1rem"
                      counterwidth="6rem"
                      counterfontsize="0.825rem"
                      wrapperwidth="6rem"
                      iconsize="0.625rem"
                      setItemQuantity={setItemQuantity}
                      product={item}
                      counterpadding="0.5rem"
                    />
                  </td>
                  <td>
                    <Flexbox
                      flex="flex"
                      alignitems="center"
                      justifycontent="flex-end"
                      height="100%"
                    >
                      <Content
                        paragraphmargin="0"
                        paragraphfontsize="1.25rem"
                      >
                        <p>${convertToDecimal(item.value, 2)}</p>
                      </Content>
                    </Flexbox>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
          <Flexbox
            flex="flex"
            justifycontent="flex-end"
          >
            <Content
              paragraphfontsize="1.25rem"
            >
              <Flexbox
                width="12rem"
                flex="flex"
                justifycontent="space-between"
                margin="2rem 1rem 2rem 0"
                alignitems="center"
              >
                <p>Subtotal</p>
                <p>${convertToDecimal(totalPrice, 2)}</p>
              </Flexbox>
            </Content>
          </Flexbox>
          <Flexbox
            width="100%"
            flex="flex"
            justifycontent="flex-end"
            margin="0 0 2rem"
          >
            <Button
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
              padding="1rem"
              margin="0 1rem 0 0"
              as={Link}
              to="/checkout"
              width="12rem"
            >
              Checkout
            </Button>
          </Flexbox>
        </>
      ) : (
        <>
          <Content
            margin="1rem 0"
          >
            <p>You have no items in your cart.</p>
          </Content>
          <Link
            to="/products/notebooks/wired-notebook-a5"
          >
            <Button
              to="/products"
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
            >
              Check out our notebook
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}

export default ShoppingCart
