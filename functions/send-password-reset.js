const admin = require("firebase-admin");
const serviceAccount = require('../serviceAccountKey.js');
const { getAuth } = require("firebase-admin/auth");
const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.GATSBY_SENDGRID_API_KEY);
const isAppInitialized = admin.apps.length;

if (!isAppInitialized) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.handler = async ({ body }) => {
  const { userEmail, redirectUrl } = JSON.parse(body)

  try {
    const actionCodeSettings = {
      url: redirectUrl
    }
    const actionLink = await getAuth()
      .generatePasswordResetLink(userEmail, actionCodeSettings)

    const templateData = {
      template_id: "d-0f50c87fb54b4ca3a8e9c870e22a0312",
      from: {
        email: "general@notesmithbooks.com",
        name: "Notesmith"
      },
      reply_to: {
        email: "general@notesmithbooks.com",
        name: "Notesmith"
      },
      personalizations: [
        {
          to: [
            {
              email: userEmail
            }
          ],
          dynamic_template_data: {
            link: actionLink
          }
        }
      ]
    }

    console.log(`[Netlify] Sending reset password email to user...`)
    await sendgridMail.send(templateData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Email has been successfully sent."
      }),
    };
  } catch (error) {
    console.log("[Netlify] ", error.errorInfo.message);
    let errorMsg;

    if (error.errorInfo.code === "auth/email-not-found") {
      errorMsg = "Email not found."
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errorMsg || "There was an error sending the reset password email, please try again."
      }),
    };
  }
}