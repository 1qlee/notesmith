const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST)

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { paymentId} = body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentIntent
      })
    }
  } catch (error) {
    console.error(error)
  }
}
