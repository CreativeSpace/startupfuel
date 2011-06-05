from django.conf.urls.defaults import patterns, include, url

import views

urlpatterns = patterns('',
  #url(r'^donation$', views.donation),
  url(r'^ipn$', views.IPN()),
)
