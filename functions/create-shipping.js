const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

// will have to update the paymentIntent metadata object with tracking information
const updatePaymentIntent = async (paymentId, shippingLabel) => {
  console.log("Updating payment intent...")
  await stripe.paymentIntents.update(
    paymentId,
    {
      metadata: {
        tracking: shippingLabel.tracker.tracking_code, // carrier tracking code
        trackingUrl: shippingLabel.tracker.public_url // easypost URL
      }
    }
  );
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { rateId, shipment, paymentId } = body;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
  const totalAmount = paymentIntent.amount;

  try {
    // retrieve the existing shipment by its ID
    const userShipment = await easypost.Shipment.retrieve(shipment.id);
    const shippingLabel = await userShipment.buy(rateId);

    updatePaymentIntent(paymentId, shippingLabel);

    return {
      statusCode: 200,
      body: JSON.stringify({
        shippingLabel: shippingLabel,
        url: shippingLabel.tracker.public_url,
        totalAmount: totalAmount
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
