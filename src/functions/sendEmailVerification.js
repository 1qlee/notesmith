export default async function sendEmailVerification(userEmail) {
  await fetch("/.netlify/functions/send-email-verification", {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      userEmail: userEmail,
      redirectUrl: process.env.NODE_ENV === "production" ? "https://notesmithbooks.com" : "http://localhost:8888",
    })
  }).then(res => {
    return res.json()
  }).then(async data => {
    if (data.error) {
      throw("There was an error sending the verification email, please try again.")
    }
    else {
      return null
    }
  }).catch(error => {
    return error || "There was an error sending the verification email, please try again."
  })
}