var moneyRegex = /^\$?\d+(\.\d{0,2})?$/;

$(document).ready(function() {
  $('#amount').placeholder();

  //grab the ppi
  var ppid = $('#ppid').val();
  //grab the startup name
  var startupName = $('#startup-name').val();

  //handle payment change
  var amountChange = function() {
    //clear the existing active/current highlights
    $('.prize').removeClass('active')
               .removeClass('current');

    //grab the amount
    var amt = $('#amount').val();

    //if we don't have a valid amount, clear all the highlights
    if (!amt || !moneyRegex.exec(amt)) {
      return;
    }

    //strip leading $
    if (amt[0] == '$') amt = amt.substr(1);

    //walk the amounts
    var last = null;
    $('.prize').each(function() {
      var n = parseFloat($(this).attr('data-amount'));

      //if the amount is higher, abort
      if (n > amt) {
        if (last) last.addClass('current');
        return;
      }

      $(this).addClass('active');

      last = $(this);
    });
  };
  $('#amount').keyup(amountChange)
              .change(amountChange);

  //handle payment submission
  $('#submit').click(function(event) {

    //get the amount from the form
    var amt = $('#amount').val()

    //validate amount (exists and decimal)
    if (!amt || !moneyRegex.exec(amt)) {
      alert('You must enter a valid amount');
      event.preventDefault();
      return false;
    }

    //strip leading $ is needed
    if (amt[0] == '$')
      amt = amt.substr(1);

    //tell django we've donated
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/ajax/donation');
    //no onreadystate, because we don't care about the response :P
    xhr.send('amount=' + amt +
             '&ppid=' + escape(ppid));

    //make the paypal form and submit it
    var form = genPaypalForm(ppid, 'Donate $' + amt + ' to ' + startupName, amt);
    form.hide();
    $(document.body).append(form);
    form.submit();

    //modify the input
    $('#amount').val('Sending you to PayPal...').attr('disabled', 'disabled');

    //kill all other handlers
    return false;

  });

  //lazy-load twitter/facebook
  $('#facebook').html('<iframe src="http://www.facebook.com/plugins/like.php?app_id=171186796274800&amp;href&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:150px; height:21px;" allowTransparency="true"></iframe>');
  $('#twitter').append($('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>'));
});

var genPaypalForm = function(ppid, desc, amount) {
  var hidden = {
    business: ppid,
    cmd: '_donations',
    item_name: desc,
    currency_code: 'CAD',
    amount: amount,
    'return': window.location.href
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
