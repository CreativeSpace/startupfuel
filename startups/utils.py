from django.db.models import Sum

from models import Donation

def get_percent_done():
    total = Donation.objects.aggregate(amount_raised=Sum('amount'))['amount_raised'] or 0
    print total
    return (100.0 - (total / 500.0)*100)
