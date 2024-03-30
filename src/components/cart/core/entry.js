import { format, formatISO } from 'date-fns'
import { isBrowser } from '../../../utils/helper-functions'

export const formatCurrencyString = ({
  value,
  currency,
  language = isBrowser() ? navigator.language : 'en-US'
}) => {
  const numberFormat = new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol'
  })
  const parts = numberFormat.formatToParts(value)
  let zeroDecimalCurrency = true

  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
      break
    }
  }

  value = zeroDecimalCurrency ? value : parseFloat((value / 100).toFixed(2))
  return numberFormat.format(value)
}

export function updateFormattedTotalPrice(state) {
  state.formattedTotalPrice = formatCurrencyString({
    value: state.totalPrice,
    currency: state.currency,
    language: state.language
  })
}

export function updateFormattedValue(state, id) {
  state.cartDetails[id].formattedValue = formatCurrencyString({
    value: state.cartDetails[id].value,
    currency: state.currency,
    language: state.language
  })
}

export function updateFormattedPrice(state, id) {
  state.cartDetails[id].formattedPrice = formatCurrencyString({
    value: state.cartDetails[id].price,
    currency: state.currency,
    language: state.language
  })
}

export function updateCartQuantities(id, state, product, quantity) {
  const priceId = product.price_id
  // save the product quantity to the cart state if it doesn't exist
  // else increment the quantity appropriately
  if (state.cartQuantities[priceId] === undefined || state.cartQuantities[priceId] === null) {
    state.cartQuantities[priceId] = {
      [id]: {
        quantity: quantity, // [id] is equal to the cart item id
      }
    }
  }
  else {
    // check if the product id exists in the price id
    if (state.cartQuantities[priceId].hasOwnProperty(id)) {
      state.cartQuantities[priceId][id].quantity = quantity
    } 
    else {
      state.cartQuantities[priceId] = {
        ...state.cartQuantities[priceId],
        [id]: {
          quantity: quantity,
        },
      }
    }
  }
}

function getEntry({ id, product, quantity, price_metadata, product_metadata, state, count, updating, removing }) {
  if (updating) {
    updateCartQuantities(id, state, product, quantity)
  }

  if (removing) {
    delete state.cartQuantities[product.price_id][id]
    delete state.cartDetails[id]

    if (Object.keys(state.cartDetails).length === 0) {
      state.cartQuantities = {}
    }
  }

  const { price, price_id } = product
  let discounts = {
    price: undefined,
    value: undefined,
    percent: undefined,
    formattedPrice: undefined,
    formattedValue: undefined,
  }
  
  if (product.discountType === "bulk") {
    let totalQuantity = 0
    let cartItemQuantities = state.cartQuantities[price_id]

    if (cartItemQuantities) {
      for (const cartItem in cartItemQuantities) {
        const cartItemQuantity = state.cartQuantities[price_id][cartItem].quantity

        totalQuantity += cartItemQuantity
      }
    }

    if (totalQuantity >= 5 && totalQuantity < 10) {
      discounts.price = price * .95
      discounts.percent = 5
    }
    else if (totalQuantity >= 10 && totalQuantity < 20) {
      discounts.price = price * .9
      discounts.percent = 10
    }
    else if (totalQuantity >= 20) {
      discounts.price = price * .85
      discounts.percent = 15
    }
    
    // only when totalQuantity is greater than 5
    if (discounts.price) {
      discounts.value = discounts.price * quantity
      discounts.formattedPrice = formatCurrencyString({ value: discounts.price, currency: state.currency, language: state.language })
      discounts.formattedValue = formatCurrencyString({ value: discounts.value, currency: state.currency, language: state.language })

      updateCartDetails(state, { priceId: price_id, id: id }, discounts, discounts.value)

      return {
        ...product,
        id,
        quantity,
        value: product.price * quantity,
        price_data: {
          ...product.price_data,
          ...price_metadata
        },
        product_data: {
          ...product.product_data,
          ...product_metadata
        },
        discounts,
      }
    }
  }

  if (count || count === 0) {
    console.log("🚀 ~ getEntry ~ count:", count)
    resetCartDiscounts(state)
    console.log(product.price * count)
    state.totalPrice += product.price * count
  }
  else {
    if (removing) {
      resetCartDiscounts(state)
    }
    else {
      state.totalPrice += product.price * quantity
    }
  }

  return {
    ...product,
    id,
    quantity,
    value: product.price * quantity,
    price_data: {
      ...product.price_data,
      ...price_metadata
    },
    product_data: {
      ...product.product_data,
      ...product_metadata
    }
  }
}

export function resetCartDiscounts(state) {
  const cartItems = Object.values(state.cartDetails)
  let newTotalPrice = 0

  for (const cartItem of cartItems) {
    cartItem.discounts = {
      price: undefined,
      value: undefined,
      percent: undefined,
      formattedPrice: undefined,
      formattedValue: undefined,
    }

    newTotalPrice += cartItem.value
  }
  
  state.totalPrice = newTotalPrice
}

export function updateCartDetails(state, product, discounts, newItemValue) {
  const cartItems = Object.values(state.cartDetails);
  let newTotalPrice = newItemValue

  for (const cartItem of cartItems) {
    if (cartItem.price_id === product.priceId && cartItem.id !== product.id) {
      const value = discounts.price * cartItem.quantity

      cartItem.discounts = {
        price: discounts.price,
        value: value,
        percent: discounts.percent,
        formattedPrice: formatCurrencyString({ value: discounts.price, currency: state.currency, language: state.language }),
        formattedValue: formatCurrencyString({ value: value, currency: state.currency, language: state.language }),
      }

      newTotalPrice += value
    }
  }

  state.totalPrice = newTotalPrice
}

export function createEntry({
  state,
  id,
  product,
  count,
  price_metadata,
  product_metadata
}) {
  const entry = getEntry({
    id,
    product,
    quantity: count,
    price_metadata,
    product_metadata,
    timeStamp: formatISO(new Date()),
    state,
    updating: true,
  })

  state.cartDetails[id] = entry
  updateFormattedValue(state, id)
  updateFormattedPrice(state, id)

  state.cartCount += count
  updateFormattedTotalPrice(state)
}

export function updateEntry({
  state,
  id,
  count,
  price_metadata,
  product_metadata
}) {
  console.log("🚀 ~ count:", count)
  const entry = state.cartDetails[id]
  
  if (entry.quantity + count <= 0) return removeEntry({ state, id })
  
  const updatedEntry = getEntry({
    id,
    state,
    product: entry,
    quantity: entry.quantity + count,
    count,
    price_metadata,
    product_metadata,
    updating: true,
  })

  state.cartDetails[id] = updatedEntry
  updateFormattedValue(state, id)
  updateFormattedPrice(state, id)

  state.cartCount += count
  updateFormattedTotalPrice(state)
}

export function removeEntry({ state, id }) {
  const cartDetails = state.cartDetails
  const product = cartDetails[id]
  getEntry({
    id,
    product: product,
    quantity: 0,
    price_metadata: {},
    product_metadata: {},
    state,
    count: 0,
    removing: true,
  })

  state.cartCount -= product.quantity

  updateFormattedTotalPrice(state)
}

export function updateQuantity({ state, id, quantity }) {
  const entry = state.cartDetails[id]
  updateEntry({
    state,
    id,
    count: quantity - entry.quantity
  })
}