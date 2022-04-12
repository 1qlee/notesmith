const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

// will have to update the paymentIntent metadata object with tracking information
const updatePaymentIntent = async (pid, shippingLabel) => {
  console.log("Updating payment intent with tracking information.")
  await stripe.paymentIntents.update(
    pid,
    {
      metadata: {
        tracking: shippingLabel.tracker.tracking_code, // carrier tracking code
        trackingUrl: shippingLabel.tracker.public_url, // easypost URL
      }
    }
  );
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid } = body;
  const paymentIntent = await stripe.paymentIntents.retrieve(pid);
  const { rateId, shipmentId, authKey, tax, shippingRate } = paymentIntent.metadata;
  const totalAmount = paymentIntent.amount;

  try {
    // retrieve the existing shipment by its ID
    const userShipment = await easypost.Shipment.retrieve(shipmentId);
    // buy the shipping label from easypost
    const shippingLabel = await userShipment.buy(rateId);
    console.log(`Bought shipping label for: ${pid}`)

    // update the payment intent with shipping label tracking information
    updatePaymentIntent(pid, shippingLabel);

    return {
      statusCode: 200,
      body: JSON.stringify({
        shippingLabel: shippingLabel,
        trackingUrl: shippingLabel.tracker.public_url,
        totalAmount: totalAmount,
        taxRate: tax,
        shippingRate: shippingRate,
        authKey: authKey,
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
