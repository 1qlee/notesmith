const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

const validateCartItems = async (cartItems) => {
  let totalAmount = 0;
  // iterate through all cart items in cart
  for (let i = 0; i < cartItems.length; i++) {
    const { quantity, price_id } = cartItems[i];
    // retrieve product from stripe by using id
    const stripeProduct = await stripe.prices.retrieve(price_id);

    // 25% discount for pre-orders
    totalAmount += stripeProduct.unit_amount * quantity;
  }

  console.log(`[Stripe] The total amount for this order is: ${totalAmount}.`)
  return totalAmount;
};

module.exports = {
  validateCartItems,
};