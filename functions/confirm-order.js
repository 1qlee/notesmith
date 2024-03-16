const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

// will have to update the paymentIntent metadata object
const updatePaymentIntent = async (pid, orderId, datePaid) => {
  console.log("[Stripe - create-shipment] Updating payment intent with order information.")
  await stripe.paymentIntents.update(
    pid,
    {
      metadata: {
        orderId: orderId,
        datePaid: datePaid,
      }
    }
  );
}

// use the current time to generate a unique order id
const generateOrderId = (date) => {
  const randomValue = Math.floor(date * Math.random());
  let resultString = String(randomValue);

  // Pad with random characters if the length is less than 12
  while (resultString.length < 12) {
    const randomDigit = Math.floor(Math.random() * 10);
    resultString += randomDigit;
  }

  // Truncate to exactly 12 characters
  resultString = resultString.substring(0, 12);

  return resultString;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid } = body;

  // create an order id using the current time
  const datePaid = Date.now()
  const orderId = generateOrderId(datePaid)

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(pid);
    const { amount, metadata } = paymentIntent;
    const { rateId, shipmentId, authKey, tax, taxId, shipping } = metadata;

    updatePaymentIntent(pid, orderId, datePaid);

    return {
      statusCode: 200,
      body: JSON.stringify({
        amount: amount,
        authKey: authKey,
        datePaid: datePaid,
        orderId: orderId,
        rateId: rateId,
        shipmentId: shipmentId,
        shipping: shipping,
        tax: tax,
        taxId: taxId,
      })
    }
  } catch(error) {
    console.error(`[Easypost - create-shipment] Something went wrong when confirming order: ${error}`)

    return {
      statusCode: 400,
      body: JSON.stringify({
        amount: amount,
        authKey: authKey,
        datePaid: datePaid,
        error: "shipping",
        orderId: orderId,
        rateId: rateId,
        shipmentId: shipmentId,
        shipping: shipping,
        tax: tax,
        taxId: taxId,
      })
    }
  }

}
