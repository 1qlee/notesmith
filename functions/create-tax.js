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

const parseCartItems = (cartItems) => {
  const parsedCartItems = cartItems.map(item => {
    return {
      amount: item.value,
      reference: item.id,
    }
  })

  return parsedCartItems
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { cartItems, address, shippingRate } = body;

  try {
    const calculateTax = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: parseCartItems(cartItems),
      customer_details: {
        address: address,
        address_source: 'shipping',
      },
      shipping_cost: {
        amount: shippingRate.rate,
      },
      expand: ['line_items.data.tax_breakdown'],
    })

    const totalTax = calculateTax.tax_breakdown[0]
    console.log("[Stripe] Tax calculated successfully. Tax breakdown: ", totalTax)

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalTax: totalTax,
      }),
    }
  } catch(error) {
    console.error("[Stripe] Error calculating tax: ", error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        totalTax: 0,
      })
    }
  }
}