const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST)

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { paymentId } = body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    let isPaymentPaid;

    // if a charge exists on this paymentIntent, return it to the client
    // the client will then create a new paymentIntent
    if (paymentIntent.charges.data[0]) {
      isPaymentPaid = paymentIntent.charges.data[0].paid;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        isPaymentPaid: isPaymentPaid || null,
        paymentIntent: paymentIntent
      })
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Could not retrieve your order information. Please clear your cart and try again."
      })
    }
  }
}
