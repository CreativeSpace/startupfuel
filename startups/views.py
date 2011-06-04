from django.shortcuts import render

from fundfounders.startups.models import Startup

def homepage(request):
    startups = Startup.objects.all()
    return render(request, 'homepage.html', {
        'startups': startups,
        })

def project(request, slug):
    startup = Startup.objects.get(slug=slug)
    return render(request, 'project.html', {
        'startup': startup,
        })
