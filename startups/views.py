from django.shortcuts import render, get_object_or_404

from fundfounders.startups.models import Startup
from utils import get_percent_done

def homepage(request):
    startups = Startup.objects.all()
    return render(request, 'homepage.html', {
        'startups': startups,
        'total_don': get_percent_done()
        })

def about(request):
    return render(request, 'about.html', {
        'total_don': get_percent_done()
        })

def project(request, slug):
    startup = get_object_or_404(Startup, slug=slug)
    return render(request, 'project.html', {
        'startup': startup,
        'total_don': get_percent_done()
        })
