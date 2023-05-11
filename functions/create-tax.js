const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

// calculate total order amount using inventory data
const calcOrderAmount = async (cartItems) => {
  let totalAmount = 0;
  // iterate through all cart items in cart
  for (let i = 0; i < cartItems.length; i++) {
    const { quantity, price_id } = cartItems[i];
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(price_id);

    totalAmount += stripeProduct.unit_amount * quantity;
  }

  console.log(`[Stripe] The total taxable amount for this order is: ${totalAmount}.`);

  return totalAmount;
};

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { cartItems, address, shippingRate } = body;

  const calculateTax = await stripe.tax.calculations.create({
    currency: 'usd',
    line_items: [
      {
        amount: await calcOrderAmount(cartItems),
        reference: "L1",
      }
    ],
    customer_details: {
      address: address,
      address_source: 'shipping',
    },
    expand: ['line_items.data.tax_breakdown'],
  })

  console.log(calculateTax)
}