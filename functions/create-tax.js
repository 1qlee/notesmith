const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

const parseCartItems = async (cartItems) => {
  const parsedCartItems = await Promise.all(cartItems.map(async (item) => {
    const { price_id, id } = item;
    const itemPrice = await stripe.prices.retrieve(price_id);
    const discountedPrice = +itemPrice.unit_amount * .75;

    return {
      amount: discountedPrice,
      reference: id,
    }
  }));

  return parsedCartItems;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, cartItems, address, shippingRate } = body;
  const paymentIntent = await stripe.paymentIntents.retrieve(pid);
  const { metadata } = paymentIntent;
  const { shipping, subtotal } = metadata;
  const amountBeforeTax = parseInt(subtotal) + parseInt(shipping)
  const parsedCartItems = await parseCartItems(cartItems);

  try {
    const calculateTax = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: parsedCartItems,
      customer_details: {
        address: {
          line1: address.line1 || address.street1,
          line2: address.line2 || address.street2,
          postal_code: address.postal_code || address.zip,
          state: address.state,
          city: address.city,
          country: address.country,
        },
        address_source: 'shipping',
      },
      shipping_cost: {
        amount: shippingRate.rate,
      },
      expand: ['line_items.data.tax_breakdown'],
    })

    const totalTax = calculateTax.tax_breakdown[0]
    const taxAmount = totalTax.amount
    const totalAmount = amountBeforeTax + taxAmount

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
        amount: taxAmount,
        id: calculateTax.id,
      }),
    }
  } catch(error) {
    console.error("[Stripe] Error calculating tax: ", error)
    
    await stripe.paymentIntents.update(
      pid,
      {
        amount: amountBeforeTax,
      }
    )

    return {
      statusCode: 400,
      body: JSON.stringify({
        tax: 0,
        taxId: null,
      })
    }
  }
}