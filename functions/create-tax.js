const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

const parseCartItems = async (cartItems, discount) => {
  const parsedCartItems = await Promise.all(cartItems.map(async (item) => {
    const { price_id, id, quantity } = item;
    const itemPrice = await stripe.prices.retrieve(price_id);
    let price = +itemPrice.unit_amount
    let amount = price * quantity

    if (item.discounts.type === "bulk") {
      if (quantity >= 5 && quantity < 10) {
        price = itemPrice.unit_amount * 0.95;
      }
      else if (quantity >= 10 && quantity < 20) {
        price = itemPrice.unit_amount * 0.9;
      }
      else if (quantity >= 20) {
        price = itemPrice.unit_amount * 0.85;
      }
    }

    if (discount) {
      amount = price * quantity * discount
    }
    else {
      amount = price * quantity
    }

    return {
      amount: amount,
      reference: id,
      tax_code: "txcd_99999999", // for physical goods
    }
  }));

  return parsedCartItems;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { pid, cartItems, address } = body;
  const paymentIntent = await stripe.paymentIntents.retrieve(pid);
  const shipping = +paymentIntent.metadata.shipping
  const subtotal = +paymentIntent.metadata.subtotal
  const { coupon, discount } = paymentIntent.metadata
  const amountBeforeTax = subtotal + shipping
  let parsedCartItems = []
  
  if (coupon && discount) {
    parsedCartItems = await parseCartItems(cartItems, discount);
  }
  else {
    parsedCartItems = await parseCartItems(cartItems);
  }

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
        amount: shipping,
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
          tax: +taxAmount,
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