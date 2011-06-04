from django.contrib import admin

from fundfounders.startups.models import Startup, Tier, Donation

class TierInline(admin.TabularInline):
    model = Tier

class StartupAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    inlines = (TierInline,)

admin.site.register(Startup, StartupAdmin)
admin.site.register(Donation)
