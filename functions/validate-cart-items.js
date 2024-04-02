const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

const validateCartItems = async (cartItems) => {
  let totalAmount = 0;

  for (const cartItem in cartItems) {
    const item = cartItems[cartItem];
    const { quantity, price_id } = item;
    const stripeProduct = await stripe.prices.retrieve(price_id);

    if (item.discountType === "bulk") {
      if (quantity >= 5 && quantity < 10) {
        stripeProduct.unit_amount = stripeProduct.unit_amount * 0.95;
      }
      else if (quantity >= 10 && quantity < 20) {
        stripeProduct.unit_amount = stripeProduct.unit_amount * 0.9;
      }
      else if (quantity >= 20) {
        stripeProduct.unit_amount = stripeProduct.unit_amount * 0.85;
      }
    }

    totalAmount += stripeProduct.unit_amount * quantity;
  }

  console.log(`[Stripe] The total amount for this order is: ${totalAmount}.`)
  return totalAmount;
};

module.exports = {
  validateCartItems,
};