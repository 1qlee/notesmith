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

  console.log(`[Stripe] The total amount for this order is: ${totalAmount}.`)
  return totalAmount;
};

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { cartItems, paymentId, email } = body;
  const shipping = body.address;
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
    const subtotal = await calcOrderAmount(cartItems);
    // if a pid already exists
    if (paymentId) {
      console.log(`[Stripe] Updating existing paymentIntent: ${paymentId}`);
      // update the existing paymentIntent
      paymentIntent = await stripe.paymentIntents.update(
        paymentId,
        {
          amount: subtotal,
          shipping: shipping,
          receipt_email: email,
          currency: "USD",
          metadata: {
            subtotal: subtotal
          }
        }
      )
    }
    // this will only fire when cart items are new AKA when there is no stripe paymentIntent already created
    // therefore this will only be called from checkout.js
    else {
      console.log(`[Stripe] Creating new paymentIntent...`)
      // else create a new paymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: subtotal,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          subtotal: subtotal
        }
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
    console.error(`[Stripe] Could not create paymentIntent: ${error}`)

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "We could not process your request. If this problem persists, try clearing your cart and your browser's storage. Otherwise, please contact us for additional assistance."
      })
    }
  }
}
