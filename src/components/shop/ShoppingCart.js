import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { colors, fonts, widths } from "../../styles/variables"
import { convertToDecimal } from "../../utils/helper-functions"
import { useShoppingCart } from "../cart/context/cartContext"
import { CaretDown, CaretUp, Trash, ArrowSquareOut } from "@phosphor-icons/react"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import { Flexbox } from "../layout/Flexbox"
import Loader from "../misc/Loader"
import CartQuantityTracker from "./CartQuantityTracker"
import Box from "../ui/Box"
import Table from "../ui/Table"
import Button from "../ui/Button"
import Content from "../ui/Content"
import Icon from "../ui/Icon"
import StrikeText from "../misc/StrikeText"

function ShoppingCart({
  drawer,
  setShowGrayArea,
  setHideScroll,
}) {
  const {
    cartDetails,
    setItemQuantity,
    removeItem,
    formattedTotalPrice,
    handleCartClick,
    handleCloseCart,
  } = useShoppingCart()
  const [loading, setLoading] = useState(true)
  const [activeItemIds, setActiveItemIds] = useState({})
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (cartDetails) {
      // array to store cartItems
      const cartItemsArray = []
      // push all product objects in cartDetails to an array
      for (const cartItem in cartDetails) {
        const item = cartDetails[cartItem]

        cartItemsArray.push(item)
      }

      setCartItems(cartItemsArray)
      setLoading(false)
    }
    else {
      setLoading(false)
    }
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

  if (loading) {
    return <Loader />
  }
  
  if (drawer) {
    return (
      <>
        {cartItems.length > 0 ? (
          <>
            <Content
              margin="0 16px 32px"
              h1fontsize="2rem"
              h1margin="0"
            >
              <h1>Cart</h1>
            </Content>
            <Box
              maxheight="668px"
              padding="0 16px"
              overflow="hidden auto"
            >
              {cartItems.map((item, index) => (
                <Flexbox key={index}
                  margin="0 0 16px"
                  maxheight=""
                >
                  <Link
                    to={`/products/${item.category}/${item.slug}/${item.coverColor}`}
                  >
                    <GatsbyImage
                      image={getImage(item.image)}
                      alt="product thumbnail"
                    />
                  </Link>
                  <Box
                    margin="0 0 0 16px"
                    flex="1"
                  >
                    <Content
                      paragraphmargin="0"
                      paragraphfontsize="1rem"
                      margin="0 0 4px"
                    >
                      <Link
                        to={`/products/${item.category}/${item.slug}/${item.coverColor}`}
                      >
                        <p>{item.name}</p>
                      </Link>
                    </Content>
                    <Box
                      margin="8px 0 0"
                    >
                      {item.category === "notebooks" && (
                        <>
                          <Content
                            paragraphfontsize="0.875rem"
                            paragraphmargin="0"
                            paragraphcolor={colors.gray.sevenHundred}
                            spantexttransform="capitalize"
                            margin="0"
                          >
                            <p>Cover: <span>{item.coverColor}</span></p>
                            {item.leftPageData && (
                              <p>Left-side pages: <span>{item.leftPageData.template} ({item.leftPageData.pageData.spacing}mm)</span></p>
                            )}
                            {item.rightPageData && (
                              <p>Right-side pages: <span>{item.rightPageData.template} ({item.rightPageData.pageData.spacing}mm)</span></p>
                            )}
                          </Content>
                          {item.bookId && (
                            <Flexbox
                              flex="flex"
                              align="center"
                              justify="space-between"
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
                                  border={colors.borders.black}
                                  backgroundcolor={colors.white}
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
                        </>
                      )}
                    </Box>
                    <Flexbox
                      flex="flex"
                      align="center"
                      justify="space-between"
                      margin="8px 0"
                    >
                      <Button
                        fontsize="0.75rem"
                        padding="4px 6px"
                        onClick={() => removeItem(item.id)}
                        backgroundcolor={colors.gray.oneHundred}
                        color={colors.gray.nineHundred}
                      >
                        <Icon margin="0 4px 0 0">
                          <Trash size="0.75rem" />
                        </Icon>
                        <span>Remove</span>
                      </Button>
                    </Flexbox>
                    <Flexbox
                      margin="16px 0"
                      align="center"
                      justify="space-between"
                    >
                      <Content
                        paragraphmargin="0"
                      >
                        {item.discount ? (
                          <p>
                            <StrikeText
                              color={colors.gray.sixHundred}
                            >
                              ${convertToDecimal(item.originalPrice, 2)}
                            </StrikeText>
                            <span>${convertToDecimal(item.price, 2)}</span>
                          </p>
                        ) : (
                          <p>${convertToDecimal(item.price, 2)}</p>
                        )}
                      </Content>
                      <CartQuantityTracker
                        counterwidth="5rem"
                        counterfontsize="0.875rem"
                        wrapperwidth="5rem"
                        iconsize={12}
                        setItemQuantity={setItemQuantity}
                        product={item}
                        counterpadding="4px"
                      />
                      <Content
                        paragraphmargin="0"
                        margin="0 0 0 8px"
                      >
                        <p>${convertToDecimal(item.value, 2)}</p>
                      </Content>
                    </Flexbox>
                  </Box>
                </Flexbox>
              ))}
            </Box>
            <hr />
            <Box>
              <Flexbox
                align="flex-end"
                flex="flex"
                justify="flex-end"
                margin="16px 0 0"
                padding="16px"
                width="100%"
              >
                <Content
                  margin="0 8px 0 0"
                  h5margin="0"
                  headinglineheight="1"
                >
                  <h5>Subtotal</h5>
                </Content>
                <Content
                  paragraphmargin="0"
                  paragraphfontsize="1.25rem"
                  paragraphlineheight="1"
                >
                  <p>{formattedTotalPrice}</p>
                </Content>
              </Flexbox>
              <Flexbox
                padding="16px"
                width="100%"
              >
                <Button
                  backgroundcolor={colors.gray.nineHundred}
                  color={colors.gray.oneHundred}
                  padding="1rem"
                  as={Link}
                  to="/checkout"
                  width="100%"
                >
                  Checkout
                </Button>
              </Flexbox>
            </Box>
          </>
        ) : (
          <Box
            padding="16px"
            overflow="hidden auto"
          >
            <Content
              margin="0 0 32px"
              maxwidth={widths.content.normal}
              h1fontsize="2rem"
            >
              <h1>Your cart is empty</h1>
              <p>Looks like you haven't added any custom notebooks to your cart, yet. You can change that by pressing the button below!</p>
            </Content>
            <Button
              backgroundcolor={colors.gray.nineHundred}
              color={colors.gray.oneHundred}
              padding="16px 32px"
              as={Link}
              onClick={() => {
                handleCloseCart()
                setShowGrayArea(false)
                setHideScroll(false)
              }}
              to="/products/notebooks/hardcover-wired-notebook-a5-custom/white/"
            >
              Shop notebooks
            </Button>
          </Box>
        )}
      </>
    )
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
          <Table className="is-mobile">
            <thead>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th style={{textAlign:"right"}}>Total</th>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Flexbox
                      flex="flex"
                      align="center"
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
                            <p>{item.name}</p>
                          </Link>
                        </Content>
                        <Flexbox
                          flex="flex"
                          align="center"
                          justify="space-between"
                        >
                          {item.category === "notebooks" && (
                            <Button
                              fontsize="0.75rem"
                              margin="0 8px 0 0"
                              padding="3px 6px"
                              onClick={() => handleViewDetails(item.id)}
                              border={colors.borders.black}
                              backgroundcolor={colors.white}
                              color={colors.gray.nineHundred}
                            >
                              <span>Details</span>
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
                            border={colors.borders.black}
                            backgroundcolor={colors.white}
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
                                  align="center"
                                  justify="space-between"
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
                                    align="center"
                                    justify="space-between"
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
                                        border={colors.borders.black}
                                        backgroundcolor={colors.white}
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
                                      align="center"
                                      justify="space-between"
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
                                      align="center"
                                      justify="space-between"
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
                      align="center"
                      height="100%"
                    >
                      <Content
                        paragraphmargin="0"
                      >
                        {item.discount ? (
                          <p>
                            <StrikeText
                              color={colors.gray.sixHundred}
                            >
                              ${convertToDecimal(item.originalPrice, 2)}
                            </StrikeText>
                            <span>${convertToDecimal(item.price, 2)}</span>
                          </p>
                        ) : (
                          <p>${convertToDecimal(item.price, 2)}</p>
                        )}
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
                      align="center"
                      justify="flex-end"
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
            align="center"
            justify="flex-end"
          >
            <Flexbox
              align="flex-end"
              flex="flex"
              justify="space-between"
              margin="2rem 1rem 2rem 0"
              width="12rem"
            >
              <Content
                h5margin="0"
                headinglineheight="1"
              >
                <h5>Subtotal</h5>
              </Content>
              <Content
                paragraphmargin="0"
                paragraphfontsize="1.25rem"
                paragraphlineheight="1"
              >
                <p>{formattedTotalPrice}</p>
              </Content>
            </Flexbox>
          </Flexbox>
          <Flexbox
            width="100%"
            flex="flex"
            justify="flex-end"
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
        <Box>
          <Content
            paragraphfontsize="1.25rem"
            margin="0 0 32px"
            maxwidth={widths.content.normal}
          >
            <h1>Your cart is empty</h1>
            <p>Looks like you haven't added any custom notebooks to your cart, yet. You can change that by pressing the button below!</p>
          </Content>
          <Button
            backgroundcolor={colors.gray.nineHundred}
            color={colors.gray.oneHundred}
            padding="16px 32px"
            as={Link}
            to="/products/notebooks/hardcover-wired-notebook-a5-custom/white/"
          >
            Shop notebooks
          </Button>
        </Box>
      )}
    </>
  )
}

export default ShoppingCart
