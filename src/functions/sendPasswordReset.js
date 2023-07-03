export default async function sendPasswordReset(userEmail) {
  await fetch("/.netlify/functions/send-password-reset", {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      userEmail: userEmail,
      redirectUrl: "https://notesmithbooks.com",
    })
  }).then(async res => {
    const data = await res.json()
    console.log(data)

    if (data.error) {
      return data.error || "There was an error sending the verification email, please try again."
    }
  }).catch(error => {
    return error || "There was an error sending the verification email, please try again."
  })
}