const TaxjarApi = require('taxjar')
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const taxjar = new TaxjarApi({
  apiKey: process.env.GATSBY_TAXJAR_API
});

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

// create an array with all products
// we will send this in the Taxjar API request
const createLineItems = (products) => {
  let lineItems = [];

  for (const product in products) {
    // just push the key/values that taxjar requires
    lineItems.push({
      id: products[product].id,
      quantity: products[product].quantity,
      product_tax_code: "81100", // tax-code for books
      unit_price: parseFloat(products[product].price / 100),
    });
  }

  return lineItems;
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { address, shippingRate, cartItems, pid } = body;
  const fromAddress = {
    street: '39 Knollwood Road',
    city: 'Roslyn',
    state: 'NY',
    zip: '11576',
    country: 'US',
  };
  const orderAmount = await calcOrderAmount(cartItems);
  let quantity, price, priceId;

  for (const cartItem in cartItems) {
    quantity = cartItems[cartItem].quantity;
    price = cartItems[cartItem].price;
    priceId = cartItems[cartItem].id;
  }

  try {
    // taxObject will have a 'tax' key that contains all data
    const taxObject = await taxjar.taxForOrder({
      from_street: fromAddress.street,
      from_city: fromAddress.city,
      from_state: fromAddress.state,
      from_zip: fromAddress.zip,
      from_country: fromAddress.country,
      to_street: address.line1,
      to_city: address.city,
      to_state: address.state,
      to_zip: address.postal_code,
      to_country: 'US',
      amount: orderAmount,
      shipping: shippingRate,
      line_items: createLineItems(cartItems),
    })

    // total amount the customer will pay
    const subtotalPlusShipping = taxObject.tax.order_total_amount
    const totalTax = taxObject.tax.amount_to_collect
    const totalAmountToPay = parseFloat(subtotalPlusShipping) + parseFloat(totalTax)

    // update the payment intent with the new amount
    const paymentIntent = await stripe.paymentIntents.update(
      pid,
      {
        amount: totalAmountToPay * 100,
        metadata: {
          taxRate: totalTax * 100,
          shippingRate: shippingRate * 100,
          quantity: quantity,
          price: price,
          priceId: priceId
        }
      }
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        tax: taxObject.tax.amount_to_collect
      })
    }
  } catch(error) {
    if (error.status === 400) {
      console.log("ERROR: There was an error creating a Taxjar tax rate. Most likely, tax is not applicable to the receiver's address.")

      // update the payment intent with ZERO tax
      const paymentIntent = await stripe.paymentIntents.update(
        pid,
        {
          amount: orderAmount * 100 + shippingRate * 100,
          metadata: {
            taxRate: 0,
            shippingRate: shippingRate * 100,
            quantity: quantity,
            price: price,
            priceId: priceId
          }
        }
      )

      return {
        statusCode: 200,
        body: JSON.stringify({
          tax: 0
        })
      }
    }
    else {
      return {
        statusCode: error.status,
        body: JSON.stringify({
          msg: "Something went wrong."
        })
      }
    }
  }
}
