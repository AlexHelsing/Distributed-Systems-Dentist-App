const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = '969679526606-c4hheitqmnqlpegrctdb80ge0vbgjvjo.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'; 
const REFRESH_TOKEN = '1//04Rq8DfJ-3sa4CgYIARAAGAQSNwF-L9Ir5yHodnireZkVqBPClSoI5Yq0yFttg4Toh5CJPQ4gNkM4yUy9EpgJPMhwVxdzk4YOb2k';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(notification){

    try {
        const acessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'miladtamaddondar@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                acessToken: acessToken, 
            }
        })

        const status = notification.subject.toLowerCase() === 'booking' ? 'booked' : 'canceled';

        const mailOptions = {
            from: 'mydentalcare 🦷<miladtamaddondar@gmail.com>',
            to: notification.email,
            subject: notification.subject,
            html : `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Confirmation</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
            
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #000000;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  color: #333;
                }
            
                h1 {
                  color: #3498db;
                  text-align: center;
                }
            
                p {
                  color: #555;
                  margin-bottom: 20px;
                  line-height: 1.6;
                }
            
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #3498db;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                }
            
                .button:hover {
                  background-color: #2980b9;
                }
            
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
                }
            
                .footer p {
                  margin: 5px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Email Confirmation</h1>
                <p>Dear ${notification.firstname} ${notification.lastname}</p>
                <p>Your appointment between ${notification.startTime} and ${notification.endTime} on ${notification.date} is now ${status}.</p>
                <p>For more information, please feel free to contact us:</p>
                <a href="mailto:[mydentalcaresweden@gmail.com]" class="button">Contact Us</a>
                <div class="footer">
                  <p>Best Regards,<br>MY DENTAL CARE</p>
                </div>
              </div>
            </body>
            </html>
            
            
            
            `
        };
        

        const result = await transport.sendMail(mailOptions)
        return result

    } catch (error) {
        return error
    }
}

//sendMail().then(result=> console.log('email is sent... ', result)).catch(error=> console.log(error.message))

module.exports.sendMail = sendMail;