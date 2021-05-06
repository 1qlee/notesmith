const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const sendgridMail = require('@sendgrid/mail')
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY)

exports.handler = async ({ body, headers }) => {
  try {
    // check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.GATSBY_STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === 'payment_intent.succeeded') {
      console.log("Payment Intent succeeded... Calling webhook...")
      console.log(stripeEvent)
      const address = {
        line1: "39 Knollwood Rd",
        city: "Roslyn",
        state: "NY",
        postal_code: 11576
      }
      const data = stripeEvent.data.object;
      const email = data.receipt_email || "wonq33@gmail.com";
      const shipping = data.shipping || address;

      const msg = {
        to: "wonq33@gmail.com",
        from: "general@notesmithbooks.com",
        subject: "Your Notesmith order confirmation",
        text: JSON.stringify(shipping, null, 2),
      };

      await sendgridMail.send(msg);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
}
