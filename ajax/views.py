from django.http import HttpResponse

from fundfounders.startups.models import Donation, Startup

def donation(request):
  #prep basic response stuff
  res = HttpResponse()
  res['Content-Type'] = 'application/json'

  if request.method == 'POST':
    response.write('{"err": true}')
    return respsonse

  ppid = request.POST['ppid']
  amount = float(request.POST['amount'])

  try:
    startup = Startup.objects.get(paypal_email=ppid)
  except:
    response.write('{"err": true}')
    return response

  don = Donation()
  don.startup = startup
  don.amount = amount
  don.save()

  res.write('{"success": true}')
