// File for registering signups. Requires stripe API V3
var stripe = Stripe('STRIPE_PUBLISHABLE_API_KEY'); // Replaced in build with key from env
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    iconColor: '#70C9FF',
    color: '#fff',
    fontWeight: 500,
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '15px',
    fontSmoothing: 'antialiased',

    ':-webkit-autofill': {
      color: '#fce883',
    },
    '::placeholder': {
      color: '#DDD',
    },
  },
  invalid: {
    iconColor: '#FFC7EE',
    color: '#FFC7EE',
  },
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Display card errors if they come up
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
    displayError.classList.remove('hidden');
  } else {
    displayError.textContent = 'No Card Errors';
    displayError.classList.add('hidden');
  }
});

// Create a token or display an error when the form is submitted.
var signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to server.
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var signupForm = document.getElementById('signup-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  signupForm.appendChild(hiddenInput);

  // Submit the form
  signupForm.submit();
}
// Also should try to get phone number from hash
