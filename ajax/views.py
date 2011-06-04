from django.http import HttpResponse

from fundfounders.startups.models import Payment

def donation(request):
  #prep basic response stuff
  res = HttpResponse()
  res['Content-Type'] = 'application/json'

  if request.method == 'POST':
    response.write('{"err": true}')
    return respsonse

  ppid = request.POST['ppid']
  amount = float(request.POST['amount'])

  payment = Payment()
  payment.ppid = ppid
  payment.amount = amount
  payment.save()

  res.write('{"success": true}')
