const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

// calculate total order amount using inventory data
const calcOrderAmount = async (products) => {
  let totalAmount = 0
  // iterate through all product items in cart
  for (const product in products) {
    const { quantity, id } = products[product]
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(id)

    totalAmount += stripeProduct.unit_amount * quantity
  }

  return totalAmount
}

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body)
  const { productData, paymentId, email, customer } = body
  const shipping = body.address
  let paymentIntent, newCustomer
  let products = []

  // if there are no items, return an error
  if (!productData) {
    console.error("List of items to purchase is missing.")

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        msg: "Your cart is empty."
      })
    }
  }
  else {
    for (const product in productData) {
      products.push(productData[product])
    }
  }

  try {
    // if a pid already exists
    if (paymentId) {
      // update the existing paymentIntent
      paymentIntent = await stripe.paymentIntents.update(
        paymentId,
        {
          amount: await calcOrderAmount(productData),
          shipping: shipping,
          receipt_email: email,
          currency: "USD"
        }
      )
    }
    else {
      // else create a new paymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: await calcOrderAmount(productData),
        currency: "USD"
      })
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
      })
    }
  } catch(error) {
    console.error(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Something went wrong with creating the payment intent."
      })
    }
  }
}
