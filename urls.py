from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'fundfounders.views.home', name='home'),
    # url(r'^fundfounders/', include('fundfounders.foo.urls')),

    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('fundfounders.startups.views',
    url(r'^(?P<slug>[\w-]+)/$', 'project'),
    url(r'^$', 'index'),
    (r'^ajax/', include('fundfounders.ajax.urls')),
)
