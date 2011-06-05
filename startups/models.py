from django.db import models
from django.db.models import Sum

class Startup(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='logo', null=True, blank=True)
    banner = models.ImageField(upload_to='banners', null=True, blank=True)
    website = models.URLField(blank=True)
    twitter = models.CharField(max_length=50, blank=True)
    video = models.CharField(max_length=50, blank=True)
    paypal_email = models.EmailField(blank=True)
    goal = models.IntegerField(null=True, blank=True)

    def __unicode__(self):
        return self.name

    def amount_raised(self):
        return Donation.objects.filter(startup=self).aggregate(amount_raised=Sum('amount'))['amount_raised']

    def amount_raised_percent(self):
        amount_raised = self.amount_raised()
        if amount_raised > self.goal:
            return 100
        else:
            return amount_raised / self.goal * 100

class Tier(models.Model):
    startup = models.ForeignKey(Startup)
    amount = models.IntegerField()
    incentive = models.CharField(max_length=150)

    def __unicode__(self):
        return str(self.amount)

class Donation(models.Model):
    startup = models.ForeignKey(Startup)
    amount = models.FloatField()

    def __str__(self):
        return str(self.amount)
