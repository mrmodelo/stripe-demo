const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.key);

admin.initializeApp();

exports.completeStripePayment = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    console.log(req.body)
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      });
    } else {
      
      const amount = Math.floor(req.body.amount * 100); //stripe deals in 100ths, no decimals
      const currency = 'usd';
      const orderNumber = Math.random().toString(36).substring(7)

      stripe.charges.create({
        amount: amount,
        currency: currency,
        description: 'Payment for order #' + orderNumber, 
        source: req.body.stripeToken.id,
        statement_descriptor: 'Version 1.0'
      })
      .then( stripeResponse => {  
        console.log(stripeResponse)    
        return res.send({
          status: 'charge-successful',
          receiptURL: stripeResponse.receipt_url,
          transactionId: orderNumber
        })
      }).catch(error => {
          console.error("Error creating charge: ", error);
          return res.send(
            {
              status: 'charge-failed',
              error: error
            }
          )
        })
    }
  });
});

