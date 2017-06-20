Stripe.setPublishableKey('pk_test_PdNs2fKJ4X7zjJaxFU717EJ9');

var $form = $('#checkout-form');

// Adding submit listener
$form.submit(function(event){
  $('charge-error').addClass('hidden');
  // Find the submit button on the form and set the button to disabled
  // Doing this so that the user cannot submit the form multiple times while validation is going on
  $form.find('button').prop('disabled', true);
      Stripe.card.createToken({
        // Using ID's .. #
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
        // Response handler will get executed once it's done validating the data above
      }, stripeResponseHandler);
      // To stop the form submission to server , because I haven't validated it yet
      return false;
});

      function stripeResponseHandler(status, response) {

  // Grab the form:
//   var $form = $('#payment-form');

  if (response.error) { // Problem!

    // Show the errors on the form
    $('#charge-error').text(response.error.message);
    // Display the hidden class in checkout.hbs view
    $('#charge-error').removeClass('hidden');
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();

  }
}
