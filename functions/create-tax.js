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
  const paymentIntent = await stripe.paymentIntents.retrieve(pid)
  const amount = paymentIntent.amount

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
    const taxAmount = totalTax.amount
    console.log("Total tax: ", totalAmount)
    console.log("Total before tax: ", amount)
    const totalAmount = amount + taxAmount
    console.log("total amount with tax: ", totalAmount)

    await stripe.paymentIntents.update(
      pid,
      {
        amount: totalAmount,
        metadata: {
          tax: taxAmount,
          taxId: calculateTax.id,
        }
      }
    )

    console.log("[Stripe] Tax calculated successfully.")

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