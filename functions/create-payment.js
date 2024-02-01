const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const { validateCartItems } = require('./validate-cart-items');

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { cartItems } = body;
  let paymentIntent;

  // if there are no items, return an error
  if (!cartItems.length) {
    console.error("[Netlify] There are no cart items.");

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: "Your cart is empty."
      })
    }
  }

  try {
    // save subtotal
    const subtotal = await validateCartItems(cartItems);
    console.log(`[Stripe] Creating new paymentIntent...`)
    // else create a new paymentIntent
    paymentIntent = await stripe.paymentIntents.create({
      amount: subtotal,
      currency: "usd", 
      automatic_payment_methods: {
        "enabled": true
      },
      metadata: {
        subtotal: subtotal
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        pid: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
      })
    }
  } catch(error) {
    console.error(`[Stripe] Could not create paymentIntent: ${error}`)

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "We could not process your request. If this problem persists, try clearing your cart and your browser's storage. Otherwise, please contact us for additional assistance."
      })
    }
  }
}
