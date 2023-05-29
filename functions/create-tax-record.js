const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, tax } = body;
  const taxAmount = tax.amount;
  const taxId = tax.id;

  try {
    const transaction = await stripe.tax.transactions.createFromCalculation({
      calculation: taxId,
      reference: pid,
      expand: ['line_items'],
    });
  
    await stripe.paymentIntents.update(
      pid, 
      {
        metadata: {
          taxTransactionId: transaction.id,
        }
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        amount: taxAmount,
        id: transaction.id,
      }),
    }
  } catch(error) {
    console.error(`[Stripe] Error creating tax transaction: ${error}`)

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Couldn't create tax transaction.",
      }),
    }
  }
}