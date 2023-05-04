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
      .generateEmailVerificationLink(userEmail, actionCodeSettings)

      console.log(actionLink)

    const templateData = {
      template_id: "d-c4a7c6e190f14f1b8fcb19564b276f23",
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

    console.log(`[Netlify] Sending verification email to user...`)
    await sendgridMail.send(templateData);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        msg: "Email has been successfully sent."
      }),
    };
  } catch(error) { 
    console.log("[Netlify] ", error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "There was an error sending the verification email, please try again."
      }),
    };
  }
}