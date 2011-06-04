var genForm = function() {
  var hidden = {
    business: '{{ paypal_id }}',
    cmd: '_donations',
    item_name: '{{ description }}',
    currency_code: 'CAD',
  };

  return function(amount) {
    var form = $('<form></form>');
    form.attr({
      'action': 'https://www.paypal.com/cgi-bin/webscr',
      'method': 'post'
    });

    //add the value to the hidden fields list temporarily
    hidden.amount = amount;

    //generate the hidden fields
    for (var field in hidden) if (hidden.hasOwnProperty(field)) {
      form.append($('<input></input>').attr({
        'type': 'hidden',
        'name': field,
        'value': hidden[field]
      });
    }

    //remove amount from the hidden fields list
    delete hidden.amount;

    //submit image
    form.append($('<input></input>').attr({
      'type': 'image',
      'name': 'submit',
      'border': 0,
      'alt': 'Donate via PayPal'
    }));

    //tracking pixel thingy
    form.append($('<img></img>').attr({
      alt: '',
      border: 0,
      width: 1,
      height: 1,
      src: 'https://www.paypal.com/en_US/i/scr/pixel.gif'
    }));

    return form;
  };
}();
