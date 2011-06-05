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
        return;
      }

      $(this).addClass('active');

      last = $(this);
    });

    //set the current prize
    last.addClass('current');
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

    //make the paypal form and submit it
    var form = genPaypalForm('info@ideasylum.com', 'Donate $' + amt + ' to ' + startupName, amt, ppid);
    form.hide();
    $(document.body).append(form);
    form.submit();

    //modify the input
    $('#amount').val('Sending...').attr('disabled', 'disabled');

    //kill all other handlers
    return false;

  });

  //lazy-load twitter/facebook
  $('#facebook').html('<iframe src="http://www.facebook.com/plugins/like.php?app_id=206457229389922&amp;href='+escape(document.location.href)+'&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:150px; height:21px;" allowTransparency="true"></iframe>');
  $('#twitter').append($('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>'));

  //slideshows
  $('#slideshow').each(function() {
    var div = $(this);
    var first;
    var cur;

    //ensure div is relatively positioned
    if (div.css('position') == 'static')
      div.css('position', 'relative');

    //convert our lovely links into images
    div.children('a').each(function() {
      var img = $('<img>');
      img.attr('src', $(this).attr('href'));
      img.css('position', 'absolute');
      div.append(img);
      img.hide();
      $(this).remove();

      if (!first)
        first = img;
    });

    //display the first image
    cur = div.children('img').first();
    cur.fadeIn();

    //time rotator
    setInterval(function() {
      //find the next element
      var next = cur.next();
      if (next.length == 0)
        next = first;

      //fade out the current one and fade in the next
      cur.fadeOut(1000);
      next.fadeIn(1000);

      //update cur
      cur = next;
    }, 3000);
  });

  //amount clicks
  $('.prize').click(function() {
    $('#amount').val($(this).attr('data-amount'));

    //ping the box
    amountChange();
    $('#amount').addClass('pinged');
    setTimeout(function () {
      $('#amount').removeClass('pinged');
    }, 500);
  });
});

var genPaypalForm = function(email, desc, amount, ppid) {
  var hidden = {
    business: 'info@ideasylum.com',
    cmd: '_donations',
    item_name: desc,
    item_number: ppid,
    currency_code: 'CAD',
    amount: amount,
    'return': window.location.href,
    notify_url: 'http://startupfuel.ca/ajax/ipn'
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
