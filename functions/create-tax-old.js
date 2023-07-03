const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const data =  require('./data/ny-tax-codes.json');

const calcTaxAmount = (subtotal, county) => {
  let taxRate = 0;
  const countyMatch = data.find(location => location.name === county);

  // check if county name exists in the dataset
  if (countyMatch) {
    taxRate = parseFloat(countyMatch.rate / 100);
  }
  // otherwise, just set tax to 7% which is the lowest tax rate out of all counties
  else {
    taxRate = 0.07;
  }

  console.log(`[Netlify] The tax rate is: ${taxRate}.`);
  const totalTaxAmount = Math.round(subtotal * taxRate);

  console.log(`[Netlify] The total tax amount is: ${totalTaxAmount}`);;
  return totalTaxAmount;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, county } = body;
  // retrieve paymentIntent using pid
  const paymentIntent = await stripe.paymentIntents.retrieve(pid);
  const { metadata } = paymentIntent;
  const { shippingRate, subtotal } = metadata;

  try {
    // subtotal is equal to the order amount plus the shipping cost
    const taxableAmount = parseFloat(subtotal) + parseFloat(shippingRate);
    // caculate the tax amount using subtotal (NYC tax laws include shipping cost)
    const tax = calcTaxAmount(taxableAmount, county);
    // add tax to the subtotal for the total amount to be paid
    const totalAmount = taxableAmount + tax;
    console.log(`[Netlify] Total amount to be paid is: ${totalAmount}.`);

    // update the payment intent with the new amount
    console.log(`[Netlify] Updating payment intent: ${pid}`)
    await stripe.paymentIntents.update(
      pid,
      {
        amount: totalAmount,
        metadata: {
          tax: tax,
        }
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        tax: tax
      })
    }
  }
  catch(error) {
    console.error(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Could not process your request."
      })
    }
  }
}
