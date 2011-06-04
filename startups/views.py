from django.shortcuts import render

from fundfounders.startups.models import Startup

def index(request):
    startup = Startup.objects.get(slug='hipsell') #temp
    return render(request, 'base.html', {
        'startup': startup,
        })

def project(request, slug):
    startup = Startup.objects.get(slug=slug)
    return render(request, 'project.html', {
        'startup': startup,
        })
