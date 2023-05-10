const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { paymentId, address, name, email } = body;
  console.log(paymentId)

  try {
    await stripe.paymentIntents.update(
      paymentId,
      {
        shipping: {
          name: name,
          address: address,
        },
        receipt_email: email,
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Address updated successfully."
      })
    }
  } catch(error) {
    console.error(`[Stripe] Could not update paymentIntent's address: ${error}`)

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "We could not process your request. If this problem persists, try clearing your cart and your browser's storage. Otherwise, please contact us for additional assistance."
      })
    }
  }
}