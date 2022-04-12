const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const data =  require('./data/ny-tax-codes.json');

// calculate total order amount using inventory data
const calcOrderAmount = async (cartItems) => {
  let totalAmount = 0;
  // iterate through all items in cart
  for (const cartItem in cartItems) {
    const { quantity, price_id } = cartItems[cartItem];
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(price_id);

    // total amount is simply quantity multiplied by price
    totalAmount += stripeProduct.unit_amount * quantity;
  }

  return parseFloat(totalAmount);
};

const calcTaxAmount = (subtotal, locality, county) => {
  let tax = 0;
  let taxRate = 0;
  const localityMatch = data.find(location => location.name === locality);
  const countyMatch = data.find(location => location.name === county);

  // first search if the locality exists in the dataset
  if (localityMatch) {
    taxRate = parseFloat(localityMatch.rate / 100);
  }
  // if not, then search for the county
  else if (countyMatch) {
    taxRate = parseFloat(countyMatch.rate / 100);
  }
  // otherwise, just set tax to 7% which is the lowest tax rate out of all counties
  else {
    taxRate = 0.07;
  }

  console.log(`The tax rate is: ${taxRate}.`);
  const totalTaxAmount = Math.round(subtotal * taxRate);

  console.log(`The total tax amount is: ${totalTaxAmount}`);;
  return totalTaxAmount;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address, shippingRate, cartItems, pid, locality, county } = body;
  const shipping = shippingRate * 100;
  const orderAmount = await calcOrderAmount(cartItems);

  try {
    // order amount plus shipping cost
    const subtotal = orderAmount + shipping;
    // caculate the tax amount
    const tax = calcTaxAmount(subtotal, locality, county);
    // add tax to the subtotal for the total amount to be paid
    const totalAmount = subtotal + tax;
    console.log(`Total amount to be paid is: ${totalAmount}.`);

    // update the payment intent with the new amount
    console.log(`Updating payment intent: ${pid}`)
    const paymentIntent = await stripe.paymentIntents.update(
      pid,
      {
        amount: totalAmount,
        metadata: {
          tax: tax,
          shippingRate: shipping,
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
    console.log(error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Could not process your request."
      })
    }
  }
}
