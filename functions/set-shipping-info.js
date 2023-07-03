const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const cryptojs = require("crypto-js");
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, shipmentId, rateId } = body;
  const authKey = cryptojs.MD5(pid);
  // retrieve pre-existing Shipment from Easypost
  console.log(`[Netlify] Retrieving user's shipment from Easypost: ${shipmentId}`);
  const userShipment = await easypost.Shipment.retrieve(shipmentId);
  // find the user's selected rate based on its ID
  // usershipment.rates is an array containing all rate objects
  console.log(`[Netlify] Finding user's selected rate from all shipment's rates: ${rateId}`);
  const userRate = userShipment.rates.find(rate => rate.id === rateId);
  console.log("USER RATE: " + userRate)
  const shippingCost = ((Math.ceil(userRate.rate) * 100) / 100) * 100;
  const shippingRateId = userRate.id;
  const shippingRateCarrier = userRate.carrier;

   try {
     console.log("[Netlify] Updating paymentIntent with the selected shipping information.");
     await stripe.paymentIntents.update(
       pid,
       {
         metadata: {
           shipmentId: shipmentId,
           rateId: shippingRateId,
           shipping: shippingCost,
           carrier: shippingRateCarrier,
           authKey: `${authKey}`
         }
       }
     );

     console.log("[Netlify] Successfully updated PI metadata with shipping information.");
     return {
       statusCode: 200,
       body: JSON.stringify({
         msg: "Successfully updated PI metadata with shipping information.",
         authKey: `${authKey}`
       })
     }
   } catch(error) {
     console.error("[Netlify] Something went wrong when updating shipping information.");
     return {
       statusCode: 400,
       body: JSON.stringify({
         error: "Something went wrong when updating shipping information."
       })
     }
   }
}