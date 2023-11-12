const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);

const convertToDecimal = (num, places) => {
  return ((num * 1.0) / 100).toFixed(places)
}

// email the customer a digital receipt
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
      console.log("[Stripe Webhook] Payment Intent succeeded... Calling webhook...")
      const { data } = stripeEvent;
      const { object } = data;
      const { amount, id, receipt_email, metadata, created } = object;
      const { tax, authKey, shipping, subtotal } = metadata;
      const { address } = data.shipping;
      // the date the payment was succeeded
      const date = new Date(created * 1000);

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
              address: address,
              date: date.toLocaleString(),
              subtotal: convertToDecimal(subtotal, 2),
              shippingRate: convertToDecimal(shipping, 2),
              taxRate: tax ? convertToDecimal(tax, 2) : "0",
              totalAmount: convertToDecimal(amount, 2),
              authKey: authKey,
              last4: last4 || "****",
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
    console.log(`[Netlify] Stripe webhook failed with ${error}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    };
  }
}
