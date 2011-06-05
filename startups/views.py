from django.shortcuts import render, get_object_or_404

from fundfounders.startups.models import Startup

def homepage(request):
    startups = Startup.objects.all()
    return render(request, 'homepage.html', {
        'startups': startups,
        })

def project(request, slug):
    startup = get_object_or_404(Startup, slug=slug)
    return render(request, 'project.html', {
        'startup': startup,
        })
