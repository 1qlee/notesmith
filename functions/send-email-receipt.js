const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const easypostApi = require('@easypost/api');
const easypost = new easypostApi(process.env.GATSBY_EASYPOST_API);
const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

const convertToDecimal = (num, places) => {
  return ((num * 1.0) / 100).toFixed(places);
}

// update the paymentIntent metadata object with tracking information
const updatePaymentIntent = async (pid, shippingLabel) => {
  console.log("Updating payment intent...")
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

// we're going to buy a shipping label from easypost and then send an email receipt to the customer
exports.handler = async ({ body, headers }) => {
  try {
    // check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.GATSBY_STRIPE_WEBHOOK_SECRET
    );

    // we're only checking for the event where payment intent succeeded (aka was paid for)
    if (stripeEvent.type === 'payment_intent.succeeded') {
      console.log("Payment Intent succeeded... Calling webhook...")
      const data = stripeEvent.data.object;
      const { id, receipt_email, metadata, shipping, amount, charges } = data;
      const { taxRate, shippingRate, quantity, price, priceId, authKey, shipmentId, rateId } = metadata;
      // get information regarding the product's price
      const orderItem = await stripe.prices.retrieve(priceId);
      // get information regarding the product itself
      const productItem = await stripe.products.retrieve(orderItem.product);
      // the date the payment was succeeded
      const date = new Date(charges.data[0].created * 1000);
      const { last4 } = charges.data[0].payment_method_details.card;
      const subtotal = orderItem.unit_amount * metadata.quantity;
      // retrieve the existing shipment by its ID
      const userShipment = await easypost.Shipment.retrieve(shipmentId);
      const shippingLabel = await userShipment.buy(rateId);
      const { carrier, tracking_code, public_url } = shippingLabel.tracker;
      // set tracking information in payment intent
      await stripe.paymentIntents.update(
        id,
        {
          metadata: {
            tracking: tracking_code,
            trackingUrl: public_url
          }
        }
      )

      updatePaymentIntent(id, shippingLabel);

      const templateData = {
        template_id: "d-abcd18cd57cd41aa8d857ccdfd01da92",
        from: {
          email: "general@notesmithbooks.com",
          name: "Notesmith"
        },
        reply_to: {
          email: "general@notesmithbooks.com",
          name: "Notesmith"
        },
        personalizations: [
          {
            to: [
              {
                email: receipt_email
              }
            ],
            dynamic_template_data: {
              orderId: id,
              date: date.toLocaleString(),
              productImage: productItem.images[0],
              productName: productItem.name,
              productPrice: convertToDecimal(subtotal, 2),
              subtotal: convertToDecimal(subtotal, 2),
              productQuantity: metadata.quantity,
              shippingRate: convertToDecimal(shippingRate, 2),
              taxRate: convertToDecimal(taxRate, 2),
              totalAmount: convertToDecimal(amount, 2),
              carrier: carrier,
              tracking: tracking_code,
              authKey: authKey,
              last4: last4,
              english: true
            }
          }
        ]
      }

      await sendgridMail.send(templateData);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch(error) {
    console.log(`Stripe webhook failed with ${error}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    };
  }
}
