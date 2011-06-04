from django.db import models

class Startup(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    banner = models.ImageField(upload_to='banners', null=True, blank=True)
    website = models.URLField(blank=True)
    video = models.CharField(max_length=50, blank=True)
    paypal_email = models.EmailField(blank=True)

    def __unicode__(self):
        return self.name

class Tier(models.Model):
    startup = models.ForeignKey(Startup)
    amount = models.IntegerField()
    incentive = models.CharField(max_length=150)

    def __unicode__(self):
        return str(self.value)

class Donation(models.Model):
    startup = models.ForeignKey(Startup)
    amount = models.FloatField()

    def __unicode__(self):
        return str(self.value)