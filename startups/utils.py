from django.db.models import Sum

from models import Donation

def total_raised():
    return Donation.objects.aggregate(amount_raised=Sum('amount'))['amount_raised'] or 0

def get_percent_done():
    total = total_raised()
    return (100.0 - (total / 500.0)*100)
