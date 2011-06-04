// get the csrf token
if (document.cookie && document.cookie != '') {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = jQuery.trim(cookies[i]);
    // Does this cookie string begin with the name we want?
    if (cookie.substring(0, 9 + 1) == ('csrftoken' + '=')) {
      CSRF_TOKEN = decodeURIComponent(cookie.substring(9 + 1));
      break;
    }
  }
}

var moneyRegex = /^\d+(\.\d{0,2})?$/;

$(document).ready(function() {
  $('#amount').placeholder();

  //register event handlers
  $('#submit').click(function() {

    //get the amount from the form
    var amt = $('#amount').val()

    //validate amount (exists and decimal)
    if (!amt || !moneyRegex.exec(amt)) {
      alert('You must enter a valid amount');
      return;
    }

    //tell django we've donated
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/ajax/donation');
    xhr.setRequestHeader('X-CSRFToken', CSRF_TOKEN);
    //no onreadystate, because we don't care about the response :P
    xhr.send('amount=' + amt +
             '&ppid=' + escape(ppid));

    //make the paypal form and submit it
    var form = genPaypalForm(ppid, 'Donate $' + amt, amount);
    form.hide();
    $(document.body).append(form);
    //form.submit();

    //kill all other handlers
    return false;

  });
});

var genPaypalForm = function(ppid, desc, amount) {
  var hidden = {
    business: ppid,
    cmd: '_donations',
    item_name: desc,
    currency_code: 'CAD',
    amount: amount
  };

  var form = $('<form></form>');
  form.attr({
    'action': 'https://www.paypal.com/cgi-bin/webscr',
    'method': 'post'
  });

  //generate the hidden fields
  for (var field in hidden) if (hidden.hasOwnProperty(field)) {
    form.append($('<input></input>').attr({
      'type': 'hidden',
      'name': field,
      'value': hidden[field]
    }));
  }

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
