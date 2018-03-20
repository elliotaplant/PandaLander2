const utils = require('../utils.js');
const keys = utils.getKeys();
const customer = require('../customer.json');
var stripe = require('stripe')(keys.stripeSecretKey);

if (customer.email && customer.stripeToken) {
  stripe
    .customers
    .create({email: customer.email, source: customer.stripeToken})
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
