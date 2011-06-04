
var showDonateBox = function(ppid, desc, amount) {
  var box = $('#donate-form');
  if (!box) {
    box = $('<div id="donate-form">');
    box.hide();
    $(document.body).append(box);
  } else {
    box.empty();
  }

  var desc = $('<p>' +
    "Enter the amount you'd like to donate" +
    '</p>');

  var field = $('<input>');
  var ok = $('<input type="button">');
  var cancel = $('<input type="button">');

  //build the box out
  box.append(field);
  box.append(desc);
  box.append(ok);
  box.append(cancel);

  //register event handlers
  ok.click(function() {
    box.hide();

    //tell django we've donated
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/ajax/donation');
    //no onreadystate, because we don't care about the response :P
    xhr.send('amount=' + amount +
             '&ppid=' + escape(ppid));

    //make the paypal form and submit it
    getPaypalForm(ppid, desc, amount);//.submit();
  };
  cancel.click(function() {
    box.hide();
  };
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
    });
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
