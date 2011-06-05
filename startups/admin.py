from django.contrib import admin

from fundfounders.startups.models import Startup, Tier, Donation, Photo

class TierInline(admin.TabularInline):
    model = Tier
    extra = 1

class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1

class StartupAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    inlines = (TierInline, PhotoInline)

admin.site.register(Startup, StartupAdmin)
admin.site.register(Donation)
