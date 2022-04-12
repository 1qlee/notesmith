await fetch("/.netlify/functions/retrieve-order", {
  method: "post",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    pid: orderId
  })
}).then(res => {
  return res.json()
}).then(data => {
  const { shipping, metadata, amount, charges, receipt_email } = data.paymentIntent
  const { orderItem, productItem } = data
  const date = new Date(charges.data[0].created * 1000)

  // if an authKey is provided in the URL then show personal information
  if (urlAuthKey === metadata.authKey) {
    setShowInfo(true)
    // wipe the authKey from the URL
    isBrowser && window.history.replaceState({}, "", `/orders/${orderId}`)
  }
  else {
    setShowInfo(false)
  }

  setCreatedDate(date.toLocaleString())
  setAddress(shipping.address)
  setCustomer({...customer, name: shipping.name, email: receipt_email})
  setProduct({
    name: productItem.name,
    description: productItem.description,
    images: productItem.images
  })
  setPrice({
    unit_amount: orderItem.unit_amount,
    quantity: metadata.quantity,
    shippingRate: metadata.shippingRate,
    taxRate: metadata.taxRate,
    totalAmount: amount
  })
  setTracking({
    url: metadata.trackingUrl,
    code: metadata.tracking
  })
  setLoading(false)
}).catch(err => {
  setLoading(false)
  setOrderNotFound(true)
})
