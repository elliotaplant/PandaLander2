const utils = require('../utils.js');
const keys = utils.getKeys();
const customer = require('../customer.json');
var stripe = require('stripe')(keys.stripeSecretKey);

if (customer.chargeAmount && customer.stripeCustomerId) {

  stripe
    .charges
    .create({amount: customer.chargeAmount, currency: 'usd', customer: customer.stripeCustomerId,})
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
