const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

// will have to update the paymentIntent metadata object with tracking information
const updatePaymentIntent = async (pid, shippingLabel, orderId, datePaid) => {
  const { tracking_code, public_url } = shippingLabel.tracker;
  console.log("[Stripe - create-shipment] Updating payment intent with tracking information.")
  await stripe.paymentIntents.update(
    pid,
    {
      metadata: {
        tracking: tracking_code, // carrier tracking code
        trackingUrl: public_url, // easypost URL
        orderId: orderId,
        datePaid: datePaid,
      }
    }
  );
}

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
    const { rateId, shipmentId, authKey, tax, taxId, shipping } = paymentIntent.metadata;
    const amount = paymentIntent.amount;
    // retrieve the existing shipment by its ID
    const userShipment = await easypost.Shipment.retrieve(shipmentId);
    const userShippingRate = userShipment.rates.find(rate => rate.id === rateId);
    // buy the shipping label from easypost
    const shippingLabel = await easypost.Shipment.buy(userShipment.id, userShippingRate);
    console.log(`[Easypost - create-shipment] Bought shipping label for: ${pid}`)

    // update the payment intent with shipping label tracking information
    updatePaymentIntent(pid, shippingLabel, orderId, datePaid);

    return {
      statusCode: 200,
      body: JSON.stringify({
        amount: amount,
        authKey: authKey,
        datePaid: datePaid,
        id: orderId,
        rateId: rateId,
        shipmentId: shipmentId,
        shipping: shipping,
        shippingLabel: shippingLabel,
        tax: tax,
        taxId: taxId,
        trackingUrl: shippingLabel.tracker.public_url,
      })
    }
  } catch(error) {
    console.error(`[Easypost - create-shipment] Something went wrong when buying shipping label: ${error}`)

    return {
      statusCode: 400,
      body: JSON.stringify({
        amount: amount,
        authKey: authKey,
        datePaid: datePaid,
        error: "shipping",
        id: orderId,
        rateId: rateId,
        shipmentId: shipmentId,
        shipping: shipping,
        tax: tax,
        taxId: taxId,
      })
    }
  }

}
