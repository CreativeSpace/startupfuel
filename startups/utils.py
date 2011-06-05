from django.db.models import Sum

from models import Donation

def get_total_donations():
    return Donation.objects.aggregate(amount_raised=Sum('amount'))['amount_raised'] or 0
