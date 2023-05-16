const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid } = body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(pid);
    const { metadata } = paymentIntent;
    const { shipping, tax, subtotal } = metadata;
    const shippingCost = parseInt(shipping);
    const taxCost = parseInt(tax);
    const subCost = parseInt(subtotal);
    const totalAmount = subCost + shippingCost + taxCost;
    
    const finalPaymentIntent = await stripe.paymentIntents.update(pid, {
      amount: totalAmount,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentIntent: finalPaymentIntent,
      })
    }
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "We could not process your payment. Please try again."
      })
    }
  }
}