const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { pid } = body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(pid);
    const { priceId } = paymentIntent.metadata;
    const orderItem = await stripe.prices.retrieve(priceId);
    const productItem = await stripe.products.retrieve(orderItem.product);

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentIntent: paymentIntent,
        orderItem: orderItem,
        productItem: productItem
      })
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Could not retrieve your order information. Please check the link again."
      })
    }
  }
}
