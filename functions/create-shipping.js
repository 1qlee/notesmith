const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);
const cryptojs = require("crypto-js");

// will have to update the paymentIntent metadata object with tracking information
const updatePaymentIntent = async (pid, shippingLabel, authKey) => {
  console.log("Updating payment intent...")
  await stripe.paymentIntents.update(
    pid,
    {
      metadata: {
        tracking: shippingLabel.tracker.tracking_code, // carrier tracking code
        trackingUrl: shippingLabel.tracker.public_url, // easypost URL
        authKey: `${authKey}`
      }
    }
  );
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { rateId, shipment, pid } = body;
  const paymentIntent = await stripe.paymentIntents.retrieve(pid);
  const totalAmount = paymentIntent.amount;
  const authKey = cryptojs.MD5(pid)

  try {
    // retrieve the existing shipment by its ID
    const userShipment = await easypost.Shipment.retrieve(shipment.id);
    const shippingLabel = await userShipment.buy(rateId);

    updatePaymentIntent(pid, shippingLabel, authKey);

    return {
      statusCode: 200,
      body: JSON.stringify({
        shippingLabel: shippingLabel,
        trackingUrl: shippingLabel.tracker.public_url,
        totalAmount: totalAmount,
        authKey: `${authKey}`
      })
    }
  } catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Something went wrong."
      })
    }
  }

}
