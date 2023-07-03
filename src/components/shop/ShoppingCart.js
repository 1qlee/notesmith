import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { colors, convertToDecimal, fonts, widths } from "../../styles/variables"
import { useShoppingCart } from "../../hooks/useShoppingCart"
import { CaretDown, CaretUp, Trash, ArrowSquareOut } from "phosphor-react"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import { Flexbox } from "../layout/Flexbox"
import CartQuantityTracker from "./CartQuantityTracker"
import Box from "../ui/Box"
import Table from "../ui/Table"
import Button from "../ui/Button"
import Content from "../ui/Content"
import Icon from "../ui/Icon"

function ShoppingCart() {
  const {
    cartDetails,
    setItemQuantity,
    removeItem,
    formattedTotalPrice
  } = useShoppingCart()
  const [activeItemIds, setActiveItemIds] = useState({})
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    console.log(cartDetails)
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
    <>
      {cartItems.length > 0 ? (
        <>
          <Content
            margin="0 0 2rem 0"
            h1fontweight="400"
            h1fontsize="3rem"
          >
            <h1>Cart</h1>
          </Content>
          <Table>
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
                      <Box margin="0 0 0 16px">
                        <Content
                          paragraphmargin="0"
                          paragraphfontsize="1rem"
                          margin="0 0 4px"
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
                            <Button
                              fontsize="0.75rem"
                              margin="0 8px 0 0"
                              padding="3px 6px"
                              onClick={() => handleViewDetails(item.id)}
                              backgroundcolor={colors.gray.twoHundred}
                              color={colors.gray.nineHundred}
                            >
                              <span>View details</span>
                              <Icon margin="0 0 0 2px">
                                {activeItemIds[item.id] ? (
                                  <CaretUp size="0.75rem" />
                                ) : (
                                  <CaretDown size="0.75rem"  />
                                )}
                              </Icon>
                            </Button>
                          )}
                          <Button
                            fontsize="0.75rem"
                            padding="3px 6px"
                            onClick={() => removeItem(item.id)}
                            backgroundcolor={colors.gray.twoHundred}
                            color={colors.gray.nineHundred}
                          >
                            <span>Remove</span>
                            <Icon margin="0 0 0 2px">
                              <Trash size="0.75rem" />
                            </Icon>
                          </Button>
                        </Flexbox>
                        {activeItemIds[item.id] && (
                          <Box
                            margin="8px 0 0"
                          >
                            {item.category === "notebooks" && (
                              <>
                                <Flexbox
                                  flex="flex"
                                  alignitems="center"
                                  justifycontent="space-between"
                                  margin="0 0 4px 0"
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
                                    paragraphmargin="0"
                                    paragraphtexttransform="capitalize"
                                  >
                                    <p>{item.coverColor}</p>
                                  </Content>
                                </Flexbox>
                                {item.bookId && (
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
                                      paragraphfontsize="0.75rem"
                                      paragraphmargin="0"
                                      paragraphtexttransform="capitalize"
                                    >
                                      <Button
                                        fontsize="0.75rem"
                                        padding="2px 4px"
                                        onClick={() => handleViewDetails(item.id)}
                                        backgroundcolor={colors.gray.twoHundred}
                                        color={colors.gray.nineHundred}
                                        as={Link}
                                        to={`/customize/${item.slug}/${item.bookId}`}
                                      >
                                        <span>View</span>
                                        <Icon
                                          margin="0 0 0 2px"
                                        >
                                          <ArrowSquareOut size="0.75rem" />
                                        </Icon>
                                      </Button>
                                    </Content>
                                  </Flexbox>
                                )}
                                {item.leftPageData && item.rightPageData && (
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
                                        <h3>Left pages</h3>
                                      </Content>
                                      <Content
                                        paragraphfontsize="0.875rem"
                                        paragraphmargin="0"
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
                                        paragraphmargin="0"
                                        paragraphtexttransform="capitalize"
                                      >
                                        <p>{item.rightPageData.template}</p>
                                      </Content>
                                    </Flexbox>
                                  </>
                                )}
                              </>
                            )}
                          </Box>
                        )}
                      </Box>
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
                      >
                        <p>${convertToDecimal(item.value, 2)}</p>
                      </Content>
                    </Flexbox>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Flexbox
            flex="flex"
            justifycontent="flex-end"
          >
            <Content
              paragraphfontsize="1rem"
              paragraphfontfamily={fonts.secondary}
            >
              <Flexbox
                width="12rem"
                flex="flex"
                justifycontent="space-between"
                margin="2rem 1rem 2rem 0"
                h5margin="0"
                alignitems="center"
              >
                <h5>Subtotal</h5>
                <h4>{formattedTotalPrice}</h4>
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
        <Flexbox
          flex="flex"
          justifycontent="center"
          alignitems="center"
          flexdirection="column"
        >
          <Content
            textalign="center"
            h1fontsize="3rem"
            maxwidth={widths.content.index}
          >
            <h1>Your cart is empty</h1>
          </Content>
          <Link
            to="/products/notebooks/pro-wired-notebook-a5-custom"
          >
            <Button
              to="/products"
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
              padding="16px 32px"
            >
              Shop notebooks
            </Button>
          </Link>
        </Flexbox>
      )}
    </>
  )
}

export default ShoppingCart
