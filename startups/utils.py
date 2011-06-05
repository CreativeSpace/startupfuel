from django.db.models import Sum

from models import Donation

def total_raised():
    return Donation.objects.aggregate(amount_raised=Sum('amount'))['amount_raised'] or 0

def get_percent_done():
    return 100 - int(100 * (total_raised() / 500.0))
