const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);
const cryptojs = require("crypto-js");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, shipmentId, shippingRate } = body;
  const authKey = cryptojs.MD5(pid);

   try {
     console.log("Updating paymentIntent with the selected shipping information.");
     const paymentIntent = await stripe.paymentIntents.update(
       pid,
       {
         metadata: {
           shipmentId: shipmentId,
           rateId: shippingRate.id,
           authKey: `${authKey}`
         }
       }
     );

     console.log("Successfully updated PI metadata with shipping information.");
     return {
       statusCode: 200,
       body: JSON.stringify({
         msg: "Successfully updated PI metadata with shipping information.",
         authKey: `${authKey}`
       })
     }
   } catch(error) {
     console.error("Something went wrong when updating shipping information.");
     return {
       statusCode: 400,
       body: JSON.stringify({
         error: "Something went wrong when updating shipping information."
       })
     }
   }
}
