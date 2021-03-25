const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST)

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const items = data.items
  //items [ { sku: 'black-medium-shirt', quantity: 1 } ]
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 3000,
    currency: "usd",
    metadata: {integration_check: 'accept_a_payment'},
  })

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }),
  }
}
