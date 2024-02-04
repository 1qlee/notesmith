const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { pid, data } = body;

  try {
    // Update the payment intent
    const paymentIntent = await stripe.paymentIntents.update(pid, data);
    // Handle the updated payment intent
    console.log('[Stripe] Payment intent updated:', paymentIntent);

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentIntent: paymentIntent,
      })
    }
  } catch (error) {
    console.error(`[Stripe] Could not update paymentIntent: ${pid}. Returned error: `, error);

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "There was an error processing your request. Please try again. If this problem persists, please contact us.",
      })
    }
  }
}
