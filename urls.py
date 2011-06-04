from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'fundfounders.views.home', name='home'),
    # url(r'^fundfounders/', include('fundfounders.foo.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
