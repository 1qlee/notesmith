const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const { validateCartItems } = require('./validate-cart-items');

exports.handler = async (event) => {
  // product data we received from the client
  const body = JSON.parse(event.body);
  const { pid, coupon, cartItems } = body;
  const coupons = [
    { code: "GOOGLE10", discount: 0.9, text: "10% off" },
    { code: "INSTA10", discount: 0.9, text: "10% off" },
  ]

  try {
    // see if the coupon user entered matches any of the coupons we offer
    const couponMatch = coupons.find(c => c.code === coupon);

    if (couponMatch) {
      // get the paymentIntent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(pid);
      // see if it already has a shipping cost
      const { shipping } = paymentIntent.metadata;
      // calculate the subtotal of the cart items again
      const subtotal = await validateCartItems(cartItems);
      // apply the discount to the subtotal
      const discountedSubtotal = subtotal * couponMatch.discount;
      let newAmount = discountedSubtotal;

      // add the shipping cost back to the new subtotal
      if (shipping) {
        newAmount += parseInt(shipping);
      }

      // update paymentIntent with the new amount, subtotal, and coupon code
      await stripe.paymentIntents.update(pid, {
        amount: newAmount,
        metadata: {
          subtotal: discountedSubtotal,
          coupon: couponMatch.code,
          discount: couponMatch.discount
        }
      });

      console.log(`[Stripe] Applied coupon successfully to paymentIntent: ${pid}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          subtotal: discountedSubtotal,
          coupon: couponMatch,
        })
      }
    }
    else {
      console.log(`[Stripe] Coupon code is invalid: ${coupon}`);

      return {
        statusCode: 400,
        body: JSON.stringify({
          coupon: false,
          error: "The coupon code you entered is invalid."
        })
      }
    }
  } catch (error) {
    console.error(`[Stripe] Could not find paymentIntent: ${pid}`);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Something went wrong. Please try again."
      })
    }
  }
}
