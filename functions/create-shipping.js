const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY || process.env.GATSBY_STRIPE_SECRET_KEY_TEST);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API || process.env.GATSBY_EASYPOST_API_TEST);

// will have to update the paymentIntent metadata object with tracking information
const updatePaymentIntent = async (paymentId, shippingLabel) => {
  console.log("Updating payment intent...")
  const paymentIntent = await stripe.paymentIntents.update(
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
  console.log(body)
  let shippingLabel;
  // retrieve the existing shipment by its ID
  easypost.Shipment.retrieve(shipment.id).then(shipment => {
    console.log("retrieving shipment...")
    // buy method actually purchases the label
    shipment.buy(rateId).then(res => {
      console.log("buying shipping label...")
      // the response will be the shipment object
      shippingLabel = res;

      // simply update the paymentIntent with the tracking information
      updatePaymentIntent(paymentId, shippingLabel);

      return {
        statusCode: 200,
        body: JSON.stringify({
          shippingLabel: shippingLabel
        })
      }
    }).catch(err => {
      console.log(err)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Here is your FUCKing error."
        })
      }
    })
  }).catch(err => {
    console.log(err)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Something went wrong with creating the shipping label."
      })
    }
  })

}
