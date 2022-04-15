const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const data =  require('./data/ny-tax-codes.json');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid } = body;
  // retrieve paymentIntent using pid
  const paymentIntent = await stripe.paymentIntents.retrieve(pid);

  try {
    console.log(`[Netlify] Updating payment intent: ${pid} with 0 tax.`);
    const paymentIntent = await stripe.paymentIntents.update(
      pid,
      {
        metadata: {
          tax: 0,
        }
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        tax: 0,
      })
    }
  } catch(error) {
    console.error(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Could not process your request."
      })
    }
  }
}
