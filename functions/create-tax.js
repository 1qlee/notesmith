const TaxjarApi = require('taxjar')
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY_TEST)
const taxjar = new TaxjarApi({
  apiKey: process.env.GATSBY_TAXJAR_API_LIVE
});

// calculate total order amount using inventory data
const calcOrderAmount = async (products) => {
  let totalAmount = 0;
  // iterate through all product items in cart
  for (const product in products) {
    const { quantity, id } = products[product];
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(id);

    totalAmount += stripeProduct.unit_amount * quantity;
  }

  return parseFloat(totalAmount / 100);
};

// create an array with all products
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
  const { address, shippingRate, productData, paymentId } = body;
  const fromAddress = {
    street: '39 Knollwood Road',
    city: 'Roslyn',
    state: 'NY',
    zip: '11576',
    country: 'US',
  };
  const orderAmount = await calcOrderAmount(productData);

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
    line_items: createLineItems(productData),
  })

  // total amount the customer will pay
  const totalAmount = parseFloat(taxObject.tax.order_total_amount) + parseFloat(taxObject.tax.amount_to_collect)

  paymentIntent = await stripe.paymentIntents.update(
    paymentId,
    {
      amount: totalAmount * 100
    }
  )

  return {
    statusCode: 200,
    body: JSON.stringify(taxObject)
  }
}
