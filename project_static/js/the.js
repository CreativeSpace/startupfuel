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


var showDonateBox = function(ppid, description, amount) {
  var box = $('#donate-box');
  if (!box.length) {
    box = $('<div id="donate-box">');
    box.hide();
    $(document.body).append(box);
  } else {
    box.empty();
  }

  if (!amount) {
    var desc = $('<p>' +
      "Enter the amount you'd like to donate" +
      '</p>');
  } else {
    var desc = $('<p>' +
      "Donate $" + amount + "?" +
      '</p>');
  }

  var field = $('<input>');
  var ok = $('<input type="button" value="Donate">');
  var cancel = $('<input type="button" value="Cancel">');

  //build the box out
  if (!amount) //if no amount was specified, show a box
    box.append(field);
  box.append(desc);
  box.append(ok);
  box.append(cancel);

  //register event handlers
  ok.click(function() {

    //if an amount was specified use that, otherwise use the field's
    //amount
    var amt = amount || field.val()

    //validate amount
    if (!amt) { //TODO - more serious validation
      alert('You must enter an amount');
      return;
    }

    //don't need that box anymore
    box.hide();

    //tell django we've donated
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/ajax/donation');
    xhr.setRequestHeader('X-CSRFToken', CSRF_TOKEN);
    //no onreadystate, because we don't care about the response :P
    xhr.send('amount=' + amt +
             '&ppid=' + escape(ppid));

    //make the paypal form and submit it
    var form = genPaypalForm(ppid, description, amount);
    form.hide();
    $(document.body).append(form);
    //form.submit();

  });
  cancel.click(function() {
    box.hide();
  });

  //show the box
  box.show();
};

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
