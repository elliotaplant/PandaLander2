const utils = require('../utils.js');
const keys = utils.getKeys();

var stripe = require('stripe')(keys.stripeSecretKey);

const email = ''; // REPLACE WITH EMAIL OF NEW CUSTOMER
const stripeToken = ''; // REPLACE WITH STRIPE TOKEN OF NEW CUSTOMER

if (email && stripeToken) {

  stripe
    .customers
    .create({email, source: stripeToken,})
    .then(customerResponse => {
      console.log('Created customer');
      console.log(JSON.stringify(customerResponse));
    })
    .catch(error => {
      console.error('Failed to create customer');
      console.error(error);
    });
} else {
  console.log('No email or stripe token provided');
}
