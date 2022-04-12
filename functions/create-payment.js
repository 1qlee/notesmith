const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

// calculate total order amount using inventory data
const calcOrderAmount = async (cartItems) => {
  let totalAmount = 0;
  // iterate through all cart items in cart
  for (let i = 0; i < cartItems.length; i++) {
    const { quantity, price_id } = cartItems[i];
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(price_id);

    totalAmount += stripeProduct.unit_amount * quantity;
  }

  console.log(`The total amount for this order is: ${totalAmount}.`)
  return totalAmount;
};

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body)
  const { cartItems, paymentId, email, customer } = body
  const shipping = body.address
  let paymentIntent, newCustomer
  let cartItemsArray = []

  // if there are no items, return an error
  if (!cartItems) {
    console.error("There are no cart items.")

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: "Your cart is empty."
      })
    }
  }
  else {
    // productData is a tree of objects
    for (const cartItem in cartItems) {
      // push each cart item into
      cartItemsArray.push(cartItems[cartItem])
    }
  }

  try {
    // if a pid already exists
    if (paymentId) {
      console.log(`Updating existing paymentIntent: ${paymentId}`)
      // update the existing paymentIntent
      paymentIntent = await stripe.paymentIntents.update(
        paymentId,
        {
          amount: await calcOrderAmount(cartItemsArray),
          shipping: shipping,
          receipt_email: email,
          currency: "USD"
        }
      )
    }
    else {
      console.log(`Creating new paymentIntent...`)
      // else create a new paymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: await calcOrderAmount(cartItemsArray),
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
    console.log(error)

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "We could not process your request. If this problem persists, try clearing your cart and your browser's storage. Otherwise, please contact us for additional assistance."
      })
    }
  }
}
