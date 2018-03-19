const utils = require('../utils.js');
const keys = utils.getKeys();

var stripe = require('stripe')(keys.stripeSecretKey);

const amount = ''; // REPLACE WITH AMOUNT OF CHARGE
const stripeCustomerId = ''; // REPLACE WITH STRIPE CUSTOMER ID OF CUSTOMER

if (email && stripeToken) {

  stripe
    .charges
    .create({amount, currency: 'usd', customer: stripeCustomerId})
    .then(chargeResponse => {
      console.log('Charged customer');
      console.log(JSON.stringify(chargeResponse));
    })
    .catch(error => {
      console.error('Failed to charge customer');
      console.error(error);
    });;
} else {
  console.log('no email or stripe token provided');
}
