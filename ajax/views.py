from django.http import HttpResponse

from fundfounders.startups.models import Donation, Startup

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
