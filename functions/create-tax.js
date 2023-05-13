const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

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
  const { pid, cartItems, address, shippingRate } = body;

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

    await stripe.paymentIntents.update(
      pid,
      {
        metadata: {
          tax: totalTax.amount,
          taxId: calculateTax.id,
        }
      }
    )

    console.log("[Stripe] Tax calculated successfully.", calculateTax)

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