from django.http import HttpResponse
from django.core.mail import send_mail

from fundfounders.startups.models import Donation, Startup
from paypal import Endpoint

def donation(request):
  #prep basic response stuff
  res = HttpResponse()
  res['Content-Type'] = 'application/json'

  if request.method != 'POST':
    res.write('{"err": true}')
    return res

  ppid = request.POST['ppid']
  amount = float(request.POST['amount'])

  try:
    startup = Startup.objects.get(paypal_email=ppid)
  except:
    res.write('{"err": true}')
    return res

  don = Donation()
  don.startup = startup
  don.amount = amount
  don.save()

  res.write('{"success": true}')
  return res

class IPN(Endpoint):
    def process(self, data):
        amt = data['mc_gross']
        ppid = data['item_number']
        payer_email = data['payer_email']
        rec_email = data['receiver_email']

        #fetch the startup
        try:
          startup = Startup.objects.get(pk=int(ppid))
        except:
          return

        #check rec_email to avoid spoofing
        if rec_email != startup.paypal_email:
            return

        #record the donation
        don = Donation()
        don.amount = float(amt)
        don.startup = startup
        don.save()


        #send an email notification
        try:
            send_mail('Thanks for Donating to %s' % startup.name,
                '''Your donation of $%(amt)s has been processed and sent to
%(name)s.  They should be in touch with you soon regarding getting you your
reward (assuming your donation qualified for one).

    Thanks for supporting Canadian startups!

    -- StartupFuel''', 'StartupFuel <noreply@startupfuel.ca>' % {'amt': amt, 'name': startup.name},
                [payer_email], fail_silently=True)
        #if something weird happened just ignore it
        except:
            pass

