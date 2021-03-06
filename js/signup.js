// File for registering signups. Requires stripe API V3
var stripe = Stripe('STRIPE_PUBLISHABLE_API_KEY'); // Replaced in build with key from env
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    iconColor: '#444',
    color: '#000',
    fontSize: '16px',
    lineHeight: '24px',
    fontFamily: 'Muli, Helvetica, Arial',

    ':-webkit-autofill': {
      color: '#000'
    },
    '::placeholder': {
      color: '#6c757d'
    }
  },
  invalid: {
    iconColor: '#fa755a',
    color: '#fa755a'
  }
};

var classes = {
  focus: 'focus',
  empty: 'empty',
  invalid: 'invalid',
};

// Create an instance of the card Element.
var card = elements.create('card', {
  style: style,
  classes: classes
});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Display card errors if they come up
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
    displayError
      .classList
      .remove('hidden');
  } else {
    displayError.textContent = 'No Card Errors';
    displayError
      .classList
      .add('hidden');
  }
});

var submitBtn = $('#submit-btn');
// Create a token or display an error when the form is submitted.
var signupForm = document.getElementById('signup-form');
// Also should try to get phone number from hash
$('#signup-form').submit(function(event) {
  event.preventDefault();

  // Show form is submitting by changing button
  submitBtn.prop('disabled', true);
  submitBtn.addClass('disabled');
  submitBtn.removeClass('btn-outline');

  var signupForm = $(this);
  var serializedForm = signupForm.serialize();


  // Create the token with stripe
  stripe
    .createToken(card)
    .then(function(result) {
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Add the token to the form;
        serializedForm += ('&stripe-token=' + result.token.id);
        // Send the form with the token to the server
        $
          .post(signupForm.attr('action'), serializedForm)
          .then(function() {
            window.location.pathname = 'thankyou.html'
          })
          .catch(function() {
            window.location.pathname = 'thankyou.html'
          });
      }
    });
});
