const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const { validateCartItems } = require('./validate-cart-items');

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { pid, cartItems, updatePaymentIntent } = body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(pid);
    // if a charge exists on this paymentIntent, return it to the client
    // the client will then create a new paymentIntent instead
    const isPaymentPaid = paymentIntent.status === "succeeded"

    if (!isPaymentPaid && updatePaymentIntent) {
      const totalAmount = await validateCartItems(cartItems);

      await stripe.paymentIntents.update(pid, {
        amount: totalAmount,
        metadata: {
          subtotal: totalAmount,
        }
      });
    }

    console.log(`[Stripe] Found and retrieved paymentIntent: ${pid}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        isPaymentPaid: isPaymentPaid,
        paymentIntent: paymentIntent,
      })
    }
  } catch (error) {
    console.error(`[Stripe] Could not find paymentIntent: ${pid}`);
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "We could not retrieve your order information. Please clear your cart and try again."
      })
    }
  }
}
